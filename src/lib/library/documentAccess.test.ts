import { beforeEach, describe, expect, it, vi } from "vitest";
import { hasPdf, publicationFileUrl } from "./documentAccess";
import { saveUnlock } from "./mpesaCheckout";
import { serveLibraryFile } from "../../../api/_lib/libraryFile";

const mock = vi.hoisted(() => ({ product: {} as Record<string, unknown>, order: { status: "paid" }, item: { id: "item" } as { id: string } | null, download: vi.fn() }));
vi.mock("../../../api/_lib/shared.js", () => ({
  env: () => "https://storage.example.com",
  verify: (_purpose: string, _id: string, token: unknown) => token === "valid",
  json: (body: unknown, status = 200) => new Response(JSON.stringify(body), { status }),
  db: () => ({
    from: (table: string) => {
      const chain = {
        select: () => chain, eq: () => chain, limit: () => chain,
        maybeSingle: async () => ({ data: table === "products" ? mock.product : table === "orders" ? mock.order : mock.item }),
      };
      return chain;
    },
    storage: { from: () => ({ download: mock.download }) },
  }),
}));

beforeEach(() => {
  localStorage.clear();
  mock.product = { id: "pdf", title: "Document", status: "published", price_kes: 0, file_path: "products/test.pdf" };
  mock.order = { status: "paid" };
  mock.item = { id: "matching-item" };
  mock.download.mockReset().mockResolvedValue({ data: { arrayBuffer: async () => new TextEncoder().encode("%PDF-1.4\noriginal bytes").buffer } });
});

describe("publication delivery", () => {
  it("detects PDFs uploaded to either attachment or interactive fields", () => {
    expect(hasPdf({ file_path: "products/file.PDF", html_url: null, html_file_path: null })).toBe(true);
    expect(hasPdf({ file_path: null, html_url: "https://example.com/file.pdf?token=x", html_file_path: null })).toBe(true);
    expect(hasPdf({ file_path: null, html_url: null, html_file_path: "interactive/file.pdf" })).toBe(true);
    expect(hasPdf({ file_path: null, html_url: "/manifesto/index.html", html_file_path: null })).toBe(false);
  });
  it("uses same-origin delivery and includes the saved purchase proof", () => {
    saveUnlock("pdf", { orderId: "order", token: "valid" });
    expect(publicationFileUrl({ id: "pdf", slug: "report" }, "download")).toBe("/api/library/download?slug=report&orderId=order&token=valid");
  });
  it("delivers the original free PDF bytes as an attachment", async () => {
    const response = await serveLibraryFile(new Request("https://example.com/api/library/download?slug=report"), "download");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="Document.pdf"');
    expect(await response.text()).toBe("%PDF-1.4\noriginal bytes");
  });
  it("serves native PDF views inline without storage frame restrictions", async () => {
    const response = await serveLibraryFile(new Request("https://example.com/api/library/view?slug=report"), "view");
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe('inline; filename="Document.pdf"');
    expect(response.headers.get("X-Frame-Options")).toBeNull();
  });
  it("downloads PDFs accidentally attached in the interactive field", async () => {
    mock.product.file_path = null;
    mock.product.html_file_path = "interactive/report.pdf";
    expect((await serveLibraryFile(new Request("https://example.com/api/library/download?slug=report"), "download")).status).toBe(200);
    expect(mock.download).toHaveBeenCalledWith("interactive/report.pdf");
  });
  it("requires payment proof even when a priced product is flagged free", async () => {
    mock.product.price_kes = 50;
    mock.product.is_free = true;
    const response = await serveLibraryFile(new Request("https://example.com/api/library/view?slug=report"), "view");
    expect(response.status).toBe(403);
    expect(mock.download).not.toHaveBeenCalled();
  });
  it("rejects unpaid orders", async () => {
    mock.product.price_kes = 50;
    mock.order.status = "pending";
    expect((await serveLibraryFile(new Request("https://example.com/api/library/view?slug=report&orderId=order&token=valid"), "view")).status).toBe(403);
  });
  it("rejects payments for another publication", async () => {
    mock.product.price_kes = 50;
    mock.item = null;
    expect((await serveLibraryFile(new Request("https://example.com/api/library/download?slug=report&orderId=order&token=valid"), "download")).status).toBe(403);
  });
  it("allows a confirmed purchase of the requested publication", async () => {
    mock.product.price_kes = 50;
    expect((await serveLibraryFile(new Request("https://example.com/api/library/view?slug=report&orderId=order&token=valid"), "view")).status).toBe(200);
  });
});
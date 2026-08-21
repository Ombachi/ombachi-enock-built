import { describe, it, expect } from "vitest";
import { sanitizeImportedHtml, extractHtmlTitle } from "./htmlImport";

describe("html import", () => {
  it("strips scripts, styles, handlers and class/style attrs", () => {
    const out = sanitizeImportedHtml(
      `<html><head><style>p{color:red}</style></head><body><h2 class="x">Hi</h2><p style="color:red" onclick="evil()">Text</p><script>evil()</script><a href="javascript:evil()">bad</a></body></html>`
    );
    expect(out).toContain("<h2>Hi</h2>");
    expect(out).toContain("<p>Text</p>");
    expect(out).not.toContain("script");
    expect(out).not.toContain("javascript:");
  });

  it("keeps youtube iframes", () => {
    const out = sanitizeImportedHtml(`<iframe src="https://www.youtube.com/embed/abc"></iframe>`);
    expect(out).toContain("youtube.com/embed/abc");
  });

  it("extracts a title from h1 or <title>", () => {
    expect(extractHtmlTitle("<h1>My Post</h1>")).toBe("My Post");
    expect(extractHtmlTitle("<html><head><title>Doc</title></head><body></body></html>")).toBe("Doc");
  });
});

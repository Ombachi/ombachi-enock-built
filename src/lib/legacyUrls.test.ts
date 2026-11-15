import { describe, it, expect } from "vitest";
import { fixLegacyUrl, fixLegacyHtml } from "./legacyUrls";
import { isPaidProduct } from "./library/mpesaCheckout";

describe("legacy urls", () => {
  it("rewrites signed storage url", () => {
    expect(fixLegacyUrl("https://abc123.supabase.co/storage/v1/object/sign/post-images/x/a.webp?token=1")).toBe("/articles/a.webp");
  });
  it("rewrites inside html", () => {
    expect(fixLegacyHtml('<img src="https://ynwpcesdspzcuemwdmnw.supabase.co/storage/v1/object/public/post-images/b.png">')).toBe('<img src="/articles/b.png">');
  });
});
describe("pricing", () => {
  it("price above 0 is paid even if flagged free", () => {
    expect(isPaidProduct({ price_kes: 50, is_free: true })).toBe(true);
  });
  it("price 0 is free", () => {
    expect(isPaidProduct({ price_kes: 0, is_free: false })).toBe(false);
  });
});

import { fixLegacyUrl as fx } from "./legacyUrls";
import { it as it2, expect as ex2 } from "vitest";
it2("leaves new external storage links untouched", () => {
  const u = "https://hctmiqucnojaidnjgaca.supabase.co/storage/v1/object/public/post-images/a.jpeg";
  ex2(fx(u)).toBe(u);
});

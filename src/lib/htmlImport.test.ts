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

  it("preserves document structure", () => {
    const out = sanitizeImportedHtml(
      `<div class="wrap"><h2>Head</h2><ul><li>One</li><li>Two</li></ul><blockquote><p>Quoted</p></blockquote><table><thead><tr><th scope="col">A</th></tr></thead><tbody><tr><td colspan="2">B</td></tr></tbody></table><p><strong>Bold</strong> and <em>italic</em> with <a href="https://x.dev">a link</a></p><img src="https://x.dev/i.png" alt="pic"></div>`
    );
    expect(out).toContain("<h2>Head</h2>");
    expect(out).toContain("<li>One</li>");
    expect(out).toContain("<blockquote>");
    expect(out).toContain('<th scope="col">A</th>');
    expect(out).toContain('colspan="2"');
    expect(out).toContain("<strong>Bold</strong>");
    expect(out).toContain('href="https://x.dev"');
    expect(out).toContain('alt="pic"');
    expect(out).not.toContain("<div");
  });

  it("extracts a title from h1 or <title>", () => {
    expect(extractHtmlTitle("<h1>My Post</h1>")).toBe("My Post");
    expect(extractHtmlTitle("<html><head><title>Doc</title></head><body></body></html>")).toBe("Doc");
  });
});

// Takes a raw HTML document or fragment and returns clean body HTML safe to
// store as post content. Document structure is preserved: headings, paragraphs,
// lists, tables, blockquotes, links, images, emphasis and section hierarchy.
// Scripts, styles, event handlers and presentational wrappers are removed.

const ALLOWED = new Set([
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "strong", "b", "em", "i", "u", "s", "sup", "sub", "mark", "small",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  "dl", "dt", "dd", "iframe",
]);

// Removed entirely, together with their contents.
const DROP = "script,style,link,meta,noscript,template,form,input,button,select,textarea,svg,object,embed,video,audio";

const ATTRS: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  iframe: ["src", "width", "height", "allowfullscreen", "title"],
  td: ["colspan", "rowspan", "headers"],
  th: ["colspan", "rowspan", "scope"],
  col: ["span"],
  colgroup: ["span"],
  ol: ["start", "type"],
};

const unwrap = (el: Element) => {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
};

export const sanitizeImportedHtml = (raw: string): string => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const root = doc.body;

  root.querySelectorAll(DROP).forEach((el) => el.remove());

  // Only keep video embeds we can safely render.
  root.querySelectorAll("iframe").forEach((el) => {
    const src = el.getAttribute("src") ?? "";
    if (!/youtube\.com|youtu\.be|player\.vimeo\.com/i.test(src)) el.remove();
  });

  // Clean attributes on everything that survives.
  root.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const keep = ATTRS[tag] ?? [];
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (!keep.includes(name)) {
        el.removeAttribute(attr.name);
        return;
      }
      if ((name === "href" || name === "src") && (value.startsWith("javascript:") || value.startsWith("data:text"))) {
        el.removeAttribute(attr.name);
      }
    });
    if (tag === "a" && el.getAttribute("target") === "_blank") {
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  // Unwrap layout containers (div, span, section, article…) so the underlying
  // headings, paragraphs, lists and tables keep their hierarchy.
  let guard = 0;
  while (guard++ < 20) {
    const stray = [...root.querySelectorAll("*")].filter((el) => !ALLOWED.has(el.tagName.toLowerCase()));
    if (!stray.length) break;
    stray.forEach(unwrap);
  }

  // Drop empty leftovers that carry no meaning.
  root.querySelectorAll("p,li,td,th,h1,h2,h3,h4,h5,h6").forEach((el) => {
    if (!el.textContent?.trim() && !el.querySelector("img,iframe,br")) el.remove();
  });

  // Loose text nodes at the top level become paragraphs.
  [...root.childNodes].forEach((node) => {
    if (node.nodeType === 3 && node.textContent?.trim()) {
      const p = doc.createElement("p");
      p.textContent = node.textContent.trim();
      root.replaceChild(p, node);
    }
  });

  return root.innerHTML.trim();
};

// Best-effort title extraction from an imported HTML document.
export const extractHtmlTitle = (raw: string): string => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  return (doc.querySelector("h1")?.textContent || doc.title || "").trim();
};

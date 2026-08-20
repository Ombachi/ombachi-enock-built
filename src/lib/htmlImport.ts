// Takes a raw HTML document or fragment and returns clean body HTML
// safe to store as post content (scripts/styles/event handlers removed).
export const sanitizeImportedHtml = (raw: string): string => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  const root = doc.body;

  root.querySelectorAll("script, style, link, meta, noscript, iframe:not([src*='youtube']):not([src*='vimeo'])").forEach((el) => el.remove());

  root.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith("on")) el.removeAttribute(attr.name);
      if ((name === "href" || name === "src") && val.startsWith("javascript:")) el.removeAttribute(attr.name);
      if (name === "style" || name === "class") el.removeAttribute(attr.name);
    });
  });

  return root.innerHTML.trim();
};

// Best-effort title extraction from an imported HTML document.
export const extractHtmlTitle = (raw: string): string => {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  return (doc.querySelector("h1")?.textContent || doc.title || "").trim();
};
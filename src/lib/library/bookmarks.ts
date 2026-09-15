const KEY = "library_bookmarks";

export const readBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
};

export const isBookmarked = (slug: string) => readBookmarks().includes(slug);

export const toggleBookmark = (slug: string): boolean => {
  const list = readBookmarks();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next.includes(slug);
};

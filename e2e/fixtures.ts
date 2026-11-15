export const SEED_ENTRY_TITLE = "E2E seed dream";
export const SEED_ENTRY_BODY =
  "A corridor of blue glass under a low sky, and every door opened onto the same quiet shore.";

export function entryPath(href: string): string {
  return href.split("?")[0];
}

export function urlIs(pathAndSearch: string): (url: URL) => boolean {
  return (url) => `${url.pathname}${url.search}` === pathAndSearch;
}

/** Path segments the [ref] catch-all must never shadow, plus Next.js internals. */
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "plan",
  "results",
  "contact",
  "success",
  "pg-download",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_next",
]);

const SLUG_PATTERN = /^[a-z0-9_-]{2,40}$/;

export function isValidReferralSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug);
}

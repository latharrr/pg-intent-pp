export const ROUTES = {
  home: "/",
  plan: "/plan",
  results: "/results",
  contact: "/contact",
  success: "/success",
  pgDownload: "/pg-download",
} as const;

export type RouteKey = keyof typeof ROUTES;

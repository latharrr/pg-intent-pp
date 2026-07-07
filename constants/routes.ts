export const ROUTES = {
  home: "/",
  plan: "/plan",
  results: "/results",
  contact: "/contact",
  success: "/success",
} as const;

export type RouteKey = keyof typeof ROUTES;

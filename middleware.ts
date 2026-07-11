import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, getExpectedAdminToken } from "@/lib/adminAuth";

/** Gates /admin and /api/admin/* behind the admin password cookie. Login
 * itself must stay reachable, otherwise nobody could ever authenticate. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/api/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const expected = await getExpectedAdminToken();
  if (token === expected) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/api/admin/:path*"],
};

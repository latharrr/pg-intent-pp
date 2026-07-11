/**
 * Deliberately dependency-free (no `node:crypto`) so the same check works in
 * both the Node API routes and the Edge-runtime middleware that gates them.
 */
export const ADMIN_COOKIE_NAME = "pica_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "6969";
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedAdminToken(): Promise<string> {
  return sha256Hex(`picapool-admin:${getAdminPassword()}`);
}

export function checkAdminPassword(password: string): boolean {
  return password.length > 0 && password === getAdminPassword();
}

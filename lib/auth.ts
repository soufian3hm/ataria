import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE = "fadk_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "fadak123";
}

export function sessionToken(): string {
  const secret = process.env.AUTH_SECRET || "fadak-linkhub-v1";
  return createHash("sha256")
    .update(`${adminPassword()}:${secret}`)
    .digest("hex");
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(adminPassword());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === sessionToken();
}

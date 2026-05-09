import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { hashPassword, verifyPassword } from "./password";

const COOKIE_NAME = "mi_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("ADMIN_SESSION_SECRET must be set and at least 24 characters long.");
  }
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export { hashPassword, verifyPassword };

export function createSessionValue(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [username, expiresAtText, signature] = parts;
  const payload = `${username}.${expiresAtText}`;
  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  const expiresAt = Number(expiresAtText);
  if (!expiresAt || expiresAt < Math.floor(Date.now() / 1000)) return null;
  return { username, expiresAt };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionValue(value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function ensureDefaultAdmin() {
  const count = await prisma.adminUser.count();
  if (count > 0) return;

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.adminUser.create({
    data: {
      username,
      passwordHash: hashPassword(password),
    },
  });
}

export { COOKIE_NAME, SESSION_TTL_SECONDS };

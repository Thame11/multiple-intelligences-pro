import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, SESSION_TTL_SECONDS, createSessionValue, ensureDefaultAdmin, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await ensureDefaultAdmin();
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const admin = await prisma.adminUser.findUnique({ where: { username: parsed.username } });
    if (!admin || !verifyPassword(parsed.password, admin.passwordHash)) {
      return NextResponse.json({ message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, redirectTo: "/admin" });
    response.cookies.set(COOKIE_NAME, createSessionValue(admin.username), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "تعذر تسجيل الدخول" }, { status: 500 });
  }
}

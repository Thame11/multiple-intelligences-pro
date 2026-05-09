import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  const results = await prisma.result.findMany({
    where: q
      ? {
          student: {
            OR: [
              { name: { contains: q } },
              { nationalId: { contains: q } },
              { grade: { contains: q } },
              { school: { contains: q } },
            ],
          },
        }
      : undefined,
    include: { student: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(
    results.map((result) => ({
      id: result.id,
      student: result.student,
      top3: JSON.parse(result.top3Json),
      scores: JSON.parse(result.scoresJson),
      createdAt: result.createdAt,
    }))
  );
}

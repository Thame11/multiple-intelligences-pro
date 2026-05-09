import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { questions } from "@/lib/questions";
import { getTop3, scoreAssessment, validateAnswers } from "@/lib/scoring";

export const runtime = "nodejs";

const submitSchema = z.object({
  student: z.object({
    name: z.string().min(2, "اسم الطالب مطلوب"),
    nationalId: z.string().optional().nullable(),
    grade: z.string().optional().nullable(),
    school: z.string().optional().nullable(),
  }),
  answers: z.record(z.string(), z.number().min(1).max(5)),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submitSchema.parse(body);

    const answers = Object.fromEntries(
      Object.entries(parsed.answers).map(([key, value]) => [Number(key), value])
    );

    const validation = validateAnswers(answers);
    if (!validation.ok) {
      return NextResponse.json(
        { message: "توجد أسئلة لم تتم الإجابة عليها", missingQuestionIds: validation.missingQuestionIds },
        { status: 400 }
      );
    }

    const allowedQuestionIds = new Set(questions.map((q) => q.id));
    for (const id of Object.keys(answers).map(Number)) {
      if (!allowedQuestionIds.has(id)) {
        return NextResponse.json({ message: "تم إرسال سؤال غير معروف" }, { status: 400 });
      }
    }

    const scores = scoreAssessment(answers);
    const top3 = getTop3(scores);

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          name: parsed.student.name.trim(),
          nationalId: parsed.student.nationalId?.trim() || null,
          grade: parsed.student.grade?.trim() || null,
          school: parsed.student.school?.trim() || null,
        },
      });

      return tx.result.create({
        data: {
          studentId: student.id,
          answersJson: JSON.stringify(answers),
          scoresJson: JSON.stringify(scores),
          top3Json: JSON.stringify(top3),
        },
        include: { student: true },
      });
    });

    return NextResponse.json({ resultId: result.id, redirectTo: `/results/${result.id}` }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "البيانات غير مكتملة", issues: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

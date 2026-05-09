import { prisma } from "../lib/db";
import { hashPassword } from "../lib/password";
import { scoreAssessment, getTop3 } from "../lib/scoring";
import { questions } from "../lib/questions";

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hashPassword(password) },
    create: { username, passwordHash: hashPassword(password) },
  });

  const existingStudents = await prisma.student.count();
  if (existingStudents === 0) {
    const sampleAnswers = Object.fromEntries(questions.map((q) => [q.id, ((q.id % 5) + 1)]));
    const scores = scoreAssessment(sampleAnswers);
    const top3 = getTop3(scores);
    const student = await prisma.student.create({
      data: { name: "طالب تجريبي", grade: "أول متوسط", school: "مدرسة تجريبية" },
    });
    await prisma.result.create({
      data: {
        studentId: student.id,
        answersJson: JSON.stringify(sampleAnswers),
        scoresJson: JSON.stringify(scores),
        top3Json: JSON.stringify(top3),
      },
    });
  }

  console.log("✅ Database seeded successfully");
  console.log(`Admin username: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { intelligenceTypes, intelligences, type IntelligenceType } from "./intelligences";
import { questions } from "./questions";

export type Answers = Record<number, number>;

export type IntelligenceScore = {
  key: IntelligenceType;
  name: string;
  shortName: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  icon: string;
  description: string;
  learningStyle: string;
  suggestedActivities: string[];
  colorClass: string;
};

export function scoreAssessment(answers: Answers): IntelligenceScore[] {
  const scores: Record<IntelligenceType, number> = Object.fromEntries(
    intelligenceTypes.map((type) => [type, 0])
  ) as Record<IntelligenceType, number>;

  const counts: Record<IntelligenceType, number> = Object.fromEntries(
    intelligenceTypes.map((type) => [type, 0])
  ) as Record<IntelligenceType, number>;

  for (const question of questions) {
    const raw = Number(answers[question.id] ?? 0);
    const value = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 5) : 0;
    scores[question.type] += value;
    counts[question.type] += 1;
  }

  const ranked = intelligenceTypes
    .map((type) => {
      const info = intelligences[type];
      const maxScore = counts[type] * 5;
      const score = scores[type];
      const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
      return {
        key: type,
        name: info.name,
        shortName: info.shortName,
        score,
        maxScore,
        percentage,
        rank: 0,
        icon: info.icon,
        description: info.description,
        learningStyle: info.learningStyle,
        suggestedActivities: info.suggestedActivities,
        colorClass: info.colorClass,
      };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "ar"));

  return ranked.map((item, index) => ({ ...item, rank: index + 1 }));
}

export function getTop3(scores: IntelligenceScore[]) {
  return scores.slice(0, 3);
}

export function validateAnswers(answers: Answers) {
  const missing = questions.filter((q) => !answers[q.id]);
  return {
    ok: missing.length === 0,
    missingQuestionIds: missing.map((q) => q.id),
  };
}

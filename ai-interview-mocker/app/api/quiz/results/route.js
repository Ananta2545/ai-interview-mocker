import { NextResponse } from "next/server";
import { db } from "../../../../utils/db";
import { quizQuestions, quizAnswers } from "../../../../utils/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.userId, userId));

    const answers = await db.select().from(quizAnswers).where(eq(quizAnswers.userId, userId));

    const merged = questions.map(q => ({
      ...q,
      userAnswer: answers.find(a => a.questionId === q.id)?.selectedAnswer || null,
      isCorrect: answers.find(a => a.questionId === q.id)?.isCorrect || null,
    }));

    return NextResponse.json({success: true, results: merged });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

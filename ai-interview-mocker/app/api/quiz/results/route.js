import { NextResponse } from "next/server";
import { db } from "../../../../utils/db";
import { quizQuestions, quizAnswers, quizResults } from "../../../../utils/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req) {
  try {
    const { userId, quizId } = await req.json();

    if (!userId || !quizId) {
      return NextResponse.json({
        success: false,
        error: "userId and quizId are required",
      }, { status: 400 });
    }

    // 1️⃣ Get all attempts for this user and quiz, ordered by createdAt descending
    const quizResultsList = await db
      .select()
      .from(quizResults)
      .where(and(
        eq(quizResults.userId, userId),
        eq(quizResults.quizId, quizId)
      ))
      .orderBy(desc(quizResults.createdAt)); // latest first

    if (!quizResultsList || quizResultsList.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No attempts found for this quiz",
      }, { status: 404 });
    }

    // ✅ Take the first element as the latest attempt
    const quizResult = quizResultsList[0];

    // 2️⃣ Get all questions for this quiz
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    // 3️⃣ Get answers for this specific quiz attempt
    const answers = await db
      .select()
      .from(quizAnswers)
      .where(eq(quizAnswers.resultId, quizResult.id));

    // 4️⃣ Merge questions with their answers
    const merged = questions.map(q => ({
      ...q,
      userAnswer: answers.find(a => a.questionId === q.id)?.selectedAnswer || null,
      isCorrect: answers.find(a => a.questionId === q.id)?.isCorrect ?? null,
    }));

    return NextResponse.json({
      success: true,
      results: merged,
      quizInfo: {
        score: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
        quizId: quizResult.quizId,
        resultId: quizResult.id,
        createdAt: quizResult.createdAt
      },
    });

  } catch (err) {
    console.error("Error fetching results:", err);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch results",
    }, { status: 500 });
  }
}

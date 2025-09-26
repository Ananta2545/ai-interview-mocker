import { db } from "../../../../utils/db";
import { quizAnswers, quizQuestions, quizResults } from "../../../../utils/schema"; // import quizResults
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, quizId, answers } = await req.json();

    if (!userId || !quizId || !answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const insertedAnswers = [];
    let correctCount = 0;

    for (const key of Object.keys(answers)) {
      const answer = answers[key];
      const questionId = answer.questionId; // frontend must send this
      const selectedAnswer = answer.selected || null;
      const skipped = !!answer.skipped;

      if (!questionId) continue;

      const [question] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, questionId));
      if (!question) continue;

      const isCorrect = skipped || !selectedAnswer ? 0 : selectedAnswer === question.correctAnswer ? 1 : 0;
      if (isCorrect) correctCount++;

      await db.insert(quizAnswers).values({
        userId,
        questionId,
        selectedAnswer: skipped ? null : selectedAnswer,
        isCorrect,
        createdAt: new Date(),
      });

      insertedAnswers.push({
        questionId,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        correct: !!isCorrect,
      });
    }

    // Insert quiz result
    const [quizResult] = await db
      .insert(quizResults)
      .values({
        userId,
        quizId,
        score: correctCount,
        totalQuestions: Object.keys(answers).length,
        createdAt: new Date(),
      })
      .returning({ id: quizResults.id }); // use table object

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      resultId: quizResult.id,
      answers: insertedAnswers,
    });

  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ message: error.message || "Server down" }, { status: 500 });
  }
}

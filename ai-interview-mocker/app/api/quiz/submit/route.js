import { db } from "../../../../utils/db";
import { quizAnswers, quizQuestions, quizResults } from "../../../../utils/schema"; // import quizResults
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, quizId, answers } = await req.json();

    if (!userId || !quizId || !answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields" 
      }, { status: 400 });
    }

    const insertedAnswers = [];
    let correctCount = 0;

    for (const key of Object.keys(answers)) {
      const answer = answers[key];
      const questionId = answer.questionId;
      const selectedAnswer = answer.selected || "";  // Use empty string instead of null
      const skipped = !!answer.skipped;

      // Skip if questionId is missing or invalid
      if (!questionId || questionId === undefined || questionId === null) {
        console.warn(`Skipping answer with missing questionId for key ${key}`);
        continue;
      }

      const [question] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, questionId));
      if (!question) {
        console.warn(`Question not found for questionId: ${questionId}`);
        continue;
      }

      const isCorrect = skipped || !selectedAnswer ? 0 : selectedAnswer === question.correctAnswer ? 1 : 0;
      if (isCorrect) correctCount++;

      await db.insert(quizAnswers).values({
        userId,
        questionId,
        selectedAnswer: selectedAnswer || "SKIPPED", 
        isCorrect,
        createdAt: new Date(),
      });

      insertedAnswers.push({
        questionId,
        selectedAnswer: selectedAnswer || "SKIPPED",
        correctAnswer: question.correctAnswer,
        correct: !!isCorrect,
        skipped: skipped,
      });
    }

    // Validate that we have at least one valid answer
    if (insertedAnswers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No valid answers to submit. Please try again."
      }, { status: 400 });
    }

    // Insert quiz result - use insertedAnswers length for accurate count
    const [quizResult] = await db
      .insert(quizResults)
      .values({
        userId,
        quizId,
        score: correctCount,
        totalQuestions: insertedAnswers.length,
        createdAt: new Date(),
      })
      .returning({ id: quizResults.id });

    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      resultId: quizResult.id,
      answers: insertedAnswers,
    });

  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message || "Failed to submit quiz. Please try again.",
      message: "Server error" 
    }, { status: 500 });
  }
}

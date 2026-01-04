import { db } from "../../../../utils/db";
import { quizAnswers, quizQuestions, quizResults } from "../../../../utils/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, quizId, answers } = await req.json();

    if (!userId || !quizId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🧩 1️⃣ Delete any previous result + its answers for this user and quiz
    const [existingResult] = await db
      .select()
      .from(quizResults)
      .where(and(eq(quizResults.userId, userId), eq(quizResults.quizId, quizId)));

    if (existingResult) {
      // delete previous answers linked to that result
      await db.delete(quizAnswers).where(eq(quizAnswers.resultId, existingResult.id));
      // delete the previous result itself
      await db.delete(quizResults).where(eq(quizResults.id, existingResult.id));
    }

    // 🧩 2️⃣ Create a brand-new quiz result
    const [newResult] = await db
      .insert(quizResults)
      .values({
        userId,
        quizId,
        score: 0,
        totalQuestions: 0,
        createdAt: new Date(),
      })
      .returning({ id: quizResults.id });

    const quizResult = newResult;

    // 🧠 3️⃣ Process all answers
    let correctCount = 0;
    const validAnswers = [];

    for (const key of Object.keys(answers)) {
      const answer = answers[key];
      const questionId = answer.questionId;
      const selectedAnswer = answer.selected || "";
      const skipped = !!answer.skipped;

      const [question] = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.id, questionId));
      if (!question) continue;

      const isCorrect =
        skipped || !selectedAnswer
          ? 0
          : selectedAnswer === question.correctAnswer
          ? 1
          : 0;
      if (isCorrect) correctCount++;

      validAnswers.push({
        questionId,
        selectedAnswer: selectedAnswer || "SKIPPED",
        correctAnswer: question.correctAnswer,
        isCorrect,
        skipped,
      });
    }

    // 🧩 4️⃣ Update result with score and total questions
    await db
      .update(quizResults)
      .set({
        score: correctCount,
        totalQuestions: validAnswers.length,
      })
      .where(eq(quizResults.id, quizResult.id));

    // 🧩 5️⃣ Insert new answers
    const insertedAnswers = [];
    for (const answer of validAnswers) {
      await db.insert(quizAnswers).values({
        userId,
        questionId: answer.questionId,
        resultId: quizResult.id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
        createdAt: new Date(),
      });
      insertedAnswers.push(answer);
    }

    // ✅ 6️⃣ Send back the new result
    return NextResponse.json({
      success: true,
      message: "Quiz submitted successfully",
      resultId: quizResult.id,
      answers: insertedAnswers,
      score: correctCount,
      totalQuestions: validAnswers.length,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit quiz.",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}

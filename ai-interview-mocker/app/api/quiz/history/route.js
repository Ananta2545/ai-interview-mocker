import { auth } from "@clerk/nextjs/server";
// import { db } from "@/utils/db";
import {db} from '../../../../utils/db'
import { quizzes, quizResults, quizQuestions, quizAnswers } from "../../../../utils/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all quizzes first
    const userQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(desc(quizzes.createdAt));

    // For each quiz, get the latest result
    const quizzesWithStatus = await Promise.all(
      userQuizzes.map(async (quiz) => {
        const result = await db
          .select()
          .from(quizResults)
          .where(eq(quizResults.quizId, quiz.id))
          .orderBy(desc(quizResults.createdAt))
          .limit(1);

        return {
          ...quiz,
          completed: result.length > 0,
          score: result[0]?.score || null,
          totalQuestions: result[0]?.totalQuestions || quiz.questionCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      quizzes: quizzesWithStatus,
    });

  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quiz history" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quizId } = await req.json();

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    // Verify the quiz belongs to the user
    const quiz = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz.length || quiz[0].userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Quiz not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete related records first (due to foreign key constraints)
    
    // 1. Get all question IDs for this quiz
    const questions = await db
      .select({ id: quizQuestions.id })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    // 2. Delete quiz answers for these questions (if any)
    if (questions.length > 0) {
      for (const question of questions) {
        await db.delete(quizAnswers)
          .where(eq(quizAnswers.questionId, question.id))
          .catch(() => {}); // Ignore if no answers
      }
    }

    // 3. Delete quiz results
    await db.delete(quizResults)
      .where(eq(quizResults.quizId, quizId))
      .catch(() => {}); // Ignore if no results

    // 4. Delete quiz questions
    await db.delete(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    // 5. Finally delete the quiz itself
    await db.delete(quizzes)
      .where(eq(quizzes.id, quizId));

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
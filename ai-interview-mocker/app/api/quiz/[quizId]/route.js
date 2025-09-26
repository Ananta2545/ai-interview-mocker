import { db } from '../../../../utils/db';
// import { quizzes, quizQuestions } from '../../../../../utils/schema';
import { quizzes, quizQuestions } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { quizId } = params;

    // Fetch quiz
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizId),
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });
    }

    // Fetch linked questions
    const questions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.quizId, quizId),
    });

    return NextResponse.json({
      success: true,
      quiz: {
        ...quiz,
        questions,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

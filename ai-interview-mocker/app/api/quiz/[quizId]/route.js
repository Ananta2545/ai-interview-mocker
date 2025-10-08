import { db } from '../../../../utils/db';
// import { quizzes, quizQuestions } from '../../../../../utils/schema';
import { quizzes, quizQuestions } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    // Await params before accessing properties (Next.js 15 requirement)
    const { quizId } = await params;
    
    // Parse quizId as integer
    const quizIdInt = parseInt(quizId, 10);
    
    if (isNaN(quizIdInt)) {
      return NextResponse.json({ success: false, error: "Invalid quiz ID" }, { status: 400 });
    }

    // Fetch quiz
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, quizIdInt),
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });
    }

    // Fetch linked questions
    const questions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.quizId, quizIdInt),
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

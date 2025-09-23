import { db } from "../../../../../utils/db.js";
import { userAnswers } from "../../../../../utils/schema.js";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { interviewId, userId } = params;

    // Fetch all answers for this interviewId + userId, latest first
    const allAnswers = await db
    .select()
    .from(userAnswers)
    .where(
        and(
        eq(userAnswers.interviewId, parseInt(interviewId)),
        eq(userAnswers.userId, userId)
        )
    )
    .orderBy(desc(userAnswers.id)); // ✅ wrap with desc()

    if (!allAnswers.length) {
      return NextResponse.json({ error: "No Evaluation found" }, { status: 404 });
    }

    // Take latest 5 answers
    const latest5 = allAnswers.slice(0, 5);

    const evaluationReport = latest5.map(a => {
      let report = a.evaluationReport;
      if (typeof report === "string") report = JSON.parse(report);
      return report;
    });

    // sum total score
    const totalScore = latest5.reduce((sum, a) => sum + a.evaluationScore, 0);

    return NextResponse.json({
      success: true,
      evaluationScore: totalScore,
      evaluationReport,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

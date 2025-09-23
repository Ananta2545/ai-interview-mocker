import { NextResponse } from 'next/server'
import {db} from '../../../utils/db.js'
import {userAnswers, mockInterview} from '../../../utils/schema.js'
import { eq } from 'drizzle-orm';
import { computeSimilarity } from '../../../utils/evaluation.js';

export async function POST(req){
    try{
        const {userId, interviewId, answerText, transcript} = await req.json();

        // fetch interview
        const interview = await db.select().from(mockInterview).where(eq(mockInterview.id, interviewId));

        if (!interview.length) {
            return NextResponse.json({ error: "Interview not found" }, { status: 402 });
        }

        const questions = interview[0].jsonMockResp;

        const evaluationReport = questions.map(q => {
            const similarity = computeSimilarity(answerText, q.answer);
            return {
                question: q.question,
                expectedAnswer: q.answer,
                userAnswer: answerText,
                similarity,
                score: Math.round(similarity * 100)
            };
        });

        const totalScore = Math.round(
            evaluationReport.reduce((sum, q) => sum + q.score, 0) / evaluationReport.length
        );

        await db.insert(userAnswers).values({
            userId,
            interviewId,
            answerText,
            transcript,
            evaluationScore: totalScore,
            evaluationReport,
        });

        return NextResponse.json({ success: true, evaluationReport, totalScore });

    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
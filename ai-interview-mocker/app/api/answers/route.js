import { NextResponse } from 'next/server'
import {db} from '../../../utils/db.js'
import {userAnswers, mockInterview} from '../../../utils/schema.js'
import { eq } from 'drizzle-orm';
import { computeSimilarity } from '../../../utils/evaluation.js';

export async function POST(req){
    try{
        const {userId, interviewId, questionIndex, answerText, transcript} = await req.json();

        // fetch interview
        const interview = await db.select().from(mockInterview).where(eq(mockInterview.id, interviewId));

        if (!interview.length) {
            return NextResponse.json({ error: "Interview not found" }, { status: 402 });
        }

        // const questions = interview[0].jsonMockResp;
        const question = interview[0].jsonMockResp[questionIndex];

        if(!question){
            return NextResponse.json({error: "Question not found"},{status: 404});
        }

        const similarity = computeSimilarity(answerText, question.answer);
        const score = Math.round(similarity * 100);

        const evaluationReport = {
            question: question.question,
            expectedAnswer: question.answer,
            userAnswer: answerText,
            similarity,
            score
        };

        // const totalScore = Math.round(
        //     evaluationReport.reduce((sum, q) => sum + q.score, 0) / evaluationReport.length
        // );

        await db.insert(userAnswers).values({
            userId,
            interviewId,
            answerText,
            transcript,
            evaluationScore: score,
            evaluationReport,
        });

        return NextResponse.json({ success: true, evaluationReport, totalScore:score });

    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
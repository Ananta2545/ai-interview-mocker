"use server";
import { NextResponse } from 'next/server';
import { db } from '../../../utils/db.js';
import { userAnswers, mockInterview } from '../../../utils/schema.js';
import { eq, and } from 'drizzle-orm';
import { getAuth } from "@clerk/nextjs/server";
const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { userId, interviewId, questionIndex, answerText, transcript } = await req.json();

    // Auth check
    const { userId: authUserId } = getAuth(req);
    if (!authUserId || authUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch interview
    const interview = await db.select().from(mockInterview).where(eq(mockInterview.id, interviewId));
    if (!interview.length) return NextResponse.json({ error: "Interview not found" }, { status: 404 });

    // Parse questions
    const questionsRaw = interview[0].jsonMockResp;
    const questions = typeof questionsRaw === "string" ? JSON.parse(questionsRaw) : questionsRaw;

    const question = questions[questionIndex];
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 400 });

    // Evaluate answer using Gemini AI
    const evaluationPrompt = `
You are an expert technical interview evaluator. 
Your job is to fairly and constructively evaluate the user's answer against the expected answer.

INTERVIEW CONTEXT:
- Job Position: ${interview[0].jobPosition}
- Job Description: ${interview[0].jobDesc}
- Experience Level: ${interview[0].jobExperience} years

QUESTION: ${question.question}
EXPECTED ANSWER: ${question.answer}
YOUR ANSWER: ${answerText}

EVALUATION RULES:
1. Be fair, objective, and supportive. Acknowledge what the user did well before pointing out areas to improve.  
2. Speak directly to the user (use "you" / "your answer"). Do not refer to "the candidate."  
3. Suggestions must be accurate, practical, and detailed — explain *how* to improve, not just what is missing.  
4. Score Technical Accuracy, Completeness, Clarity, and Relevance (each out of 25). Total score = 100.  

OUTPUT FORMAT:
Return JSON ONLY in this exact structure:
{
  "technicalAccuracy": 0,
  "completeness": 0,
  "clarity": 0,
  "relevance": 0,
  "totalScore": 0,
  "feedback": "Personalized feedback written directly to the user, highlighting strengths and specific improvements.",
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ]
}
`;


    let evaluation;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: evaluationPrompt
      });

      let content = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      content = content.replace(/```json|```/g, '').trim();
      evaluation = JSON.parse(content);
    } catch (err) {
      evaluation = {
        technicalAccuracy: 10,
        completeness: 10,
        clarity: 10,
        relevance: 10,
        totalScore: 40,
        feedback: "Fallback: Unable to parse evaluation. Manual review required.",
        keyPoints: [],
        suggestions: ["Retry answer evaluation"]
      };
    }

    // Check if answer already exists for this question
    const existing = await db.select().from(userAnswers)
      .where(and(
        eq(userAnswers.userId, userId),
        eq(userAnswers.interviewId, interviewId),
        eq(userAnswers.questionIndex, questionIndex)
      ))
      .limit(1);

      if (questionIndex === undefined || questionIndex === null) {
        return NextResponse.json({ error: "questionIndex is required" }, { status: 400 });
      }


    if (existing.length) {
      // Update existing answer
      await db.update(userAnswers)
        .set({
          answerText,
          transcript,
          evaluationScore: evaluation.totalScore,
          evaluationReport: evaluation,
          createdAt: new Date()
        })
        .where(eq(userAnswers.id, existing[0].id));
    } else {
      // Insert new answer
      await db.insert(userAnswers).values({
        userId,
        interviewId,
        questionIndex,
        answerText,
        transcript,
        evaluationScore: evaluation.totalScore,
        evaluationReport: evaluation
      });
    }

    return NextResponse.json({
      success: true,
      evaluation,
      score: evaluation.totalScore,
      questionIndex
    });

  } catch (error) {
    console.error("Error in POST /userAnswers:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
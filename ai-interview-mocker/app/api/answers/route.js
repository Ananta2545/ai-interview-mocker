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
Your job is to rigorously evaluate my answer against the expected answer.

INTERVIEW CONTEXT:
- Job Position: ${interview[0].jobPosition}
- Job Description: ${interview[0].jobDesc}
- Experience Level: ${interview[0].jobExperience} years

QUESTION: ${question.question}
EXPECTED ANSWER: ${question.answer}
MY ANSWER: ${answerText}

EVALUATION RULES (STRICT):
1. Evaluate Technical Accuracy, Completeness, Clarity, and Relevance (each out of 25). Deduct points less than 50 aggressively for:
   - Missing key details
   - Vague or incomplete answers
   - Lack of examples where expected
   - Incorrect or misleading information
2. Provide **honest, detailed, and precise scoring**. Do NOT round up or give unnecessary points.
3. Feedback must highlight **exactly what is missing or incorrect** and provide **step-by-step suggestions** to improve.
4. Use "you" and "your answer" when addressing the user.
5. Ensure that vague or incomplete answers get appropriately lower scores, even if some parts are correct.

OUTPUT FORMAT:
Return JSON ONLY in this exact structure:
{
  "technicalAccuracy": 0,
  "completeness": 0,
  "clarity": 0,
  "relevance": 0,
  "totalScore": 0,
  "feedback": "Honest, detailed feedback pointing out missing details, vagueness, and strengths.",
  "suggestions": [
    "Detailed actionable suggestion 1",
    "Detailed actionable suggestion 2",
    "Detailed actionable suggestion 3"
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

    const evaluationReport = {
        question: question.question,
        expectedAnswer: question.answer,
        userAnswer: answerText,
        ...evaluation
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
          evaluationReport: evaluationReport,
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
        evaluationReport: evaluationReport
      });
    }

    return NextResponse.json({
      success: true,
      evaluation: evaluationReport,
      score: evaluation.totalScore,
      questionIndex,
    });

  } catch (error) {
    console.error("Error in POST /userAnswers:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(req){
  try{
    const {searchParams} = new URL(req.url);
    const interviewId = searchParams.get("interviewId");
    const limit = searchParams.get('limit') || "5";
    const userId = searchParams.get("userId")

    // const {userId: authUserId} = getAuth(req);
    // if(!authUserId) return NextResponse.json({error: "Unauthorized"}, {status: 404});

    if(!interviewId || !userId){
      return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    // if(authUserId !== userId){
    //   return NextResponse.json({error: "Access denied"}, {status: 403});
    // }

    // fetching the interview details
    const interview = await db.select().from(mockInterview).where(eq(mockInterview.id, interviewId));

    if(!interview.length){
      return NextResponse.json({error: "Interview not found"}, {status: 404});
    }

    const answers = await db.select().from(userAnswers).where(and(eq(userAnswers.userId, userId), eq(userAnswers.interviewId, interviewId))).orderBy(userAnswers.createdAt).limit(parseInt(limit));

    if (!answers.length) {
      return NextResponse.json({ 
        error: "No answers found for this interview" 
      }, { status: 404 });
    }

    const formattedReports = answers.map(answer => {
      let evaluationReport = answer.evaluationReport;
      
      // Parse JSON if it's stored as string
      if (typeof evaluationReport === 'string') {
        try {
          evaluationReport = JSON.parse(evaluationReport);
        } catch (e) {
          console.error('Error parsing evaluation report:', e);
          evaluationReport = {
            question: "Error loading question",
            expectedAnswer: "Error loading expected answer",
            userAnswer: answer.answerText,
            technicalAccuracy: 0,
            completeness: 0,
            clarity: 0,
            relevance: 0,
            totalScore: 0,
            feedback: "Error loading evaluation",
            suggestions: []
          };
        }
      }
      return {
        success: true,
        evaluation: {
          question: evaluationReport.question || "Question not available",
          expectedAnswer: evaluationReport.expectedAnswer || "Expected answer not available",
          userAnswer: evaluationReport.userAnswer || answer.answerText,
          technicalAccuracy: evaluationReport.technicalAccuracy || 0,
          completeness: evaluationReport.completeness || 0,
          clarity: evaluationReport.clarity || 0,
          relevance: evaluationReport.relevance || 0,
          totalScore: evaluationReport.totalScore || answer.evaluationScore || 0,
          feedback: evaluationReport.feedback || "No feedback available",
          suggestions: evaluationReport.suggestions || []
        },
        score: answer.evaluationScore || 0,
        questionIndex: parseInt(answer.questionIndex),
        answerId: answer.id,
        createdAt: answer.createdAt
      };
    });

    const totalScore = formattedReports.reduce((sum, report) => sum + (report.score || 0), 0);
    const averageScore = formattedReports.length > 0 ? Math.round(totalScore / formattedReports.length) : 0;


    let totalTechnical = 0, totalCompleteness = 0, totalClarity = 0, totalRelevance = 0;
    
    formattedReports.forEach(report => {
      totalTechnical += report.evaluation.technicalAccuracy || 0;
      totalCompleteness += report.evaluation.completeness || 0;
      totalClarity += report.evaluation.clarity || 0;
      totalRelevance += report.evaluation.relevance || 0;
    });


    const categoryAverages = {
      technical: formattedReports.length > 0 ? Math.round(totalTechnical / formattedReports.length) : 0,
      completeness: formattedReports.length > 0 ? Math.round(totalCompleteness / formattedReports.length) : 0,
      clarity: formattedReports.length > 0 ? Math.round(totalClarity / formattedReports.length) : 0,
      relevance: formattedReports.length > 0 ? Math.round(totalRelevance / formattedReports.length) : 0
    };

    const getGrade = (score) => {
      if (score >= 90) return { grade: 'A+', description: 'Excellent', color: 'green' };
      if (score >= 80) return { grade: 'A', description: 'Very Good', color: 'blue' };
      if (score >= 70) return { grade: 'B+', description: 'Good', color: 'indigo' };
      if (score >= 60) return { grade: 'B', description: 'Satisfactory', color: 'yellow' };
      if (score >= 50) return { grade: 'C', description: 'Needs Improvement', color: 'orange' };
      return { grade: 'D', description: 'Poor', color: 'red' };
    };

    const result = {
      success: true,
      interviewDetails: {
        id: interview[0].id,
        jobPosition: interview[0].jobPosition,
        jobDesc: interview[0].jobDesc,
        jobExperience: interview[0].jobExperience,
        createdAt: interview[0].createdAt
      },
      summary: {
        totalReports: formattedReports.length,
        averageScore: averageScore,
        totalScore: totalScore,
        categoryAverages: categoryAverages,
        grade: getGrade(averageScore)
      },
      reports: formattedReports,
      fetchedAt: new Date().toISOString()
    };

    return NextResponse.json(result);


  }catch(error){
    return NextResponse.json({error: error.message || "Failed to fetch evaluation reports"}, {status: 500});
  }
}
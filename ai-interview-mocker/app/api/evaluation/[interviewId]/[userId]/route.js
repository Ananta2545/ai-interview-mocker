// import { db } from "../../../../../utils/db.js";
// import { userAnswers } from "../../../../../utils/schema.js";
// import { NextResponse } from "next/server";
// import { and, desc, eq } from "drizzle-orm";

import { mockInterview, userAnswers } from "../../../../../utils/schema.js";
import { db } from "../../../../../utils/db.js";
import { getAuth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

const { GoogleGenAI } = require("@google/genai");

// export async function GET(req, { params }) {
//   try {
//     const { interviewId, userId } = params;

//     // Fetch all answers for this interviewId + userId, latest first
//     const allAnswers = await db
//     .select()
//     .from(userAnswers)
//     .where(
//         and(
//         eq(userAnswers.interviewId, parseInt(interviewId)),
//         eq(userAnswers.userId, userId)
//         )
//     )
//     .orderBy(desc(userAnswers.id)); // ✅ wrap with desc()

//     if (!allAnswers.length) {
//       return NextResponse.json({ error: "No Evaluation found" }, { status: 404 });
//     }

//     // Take latest 5 answers
//     const latest5 = allAnswers.slice(0, 5);

//     const evaluationReport = latest5.map(a => {
//       let report = a.evaluationReport;
//       if (typeof report === "string") report = JSON.parse(report);
//       return report;
//     });

//     // sum total score
//     const totalScore = latest5.reduce((sum, a) => sum + a.evaluationScore, 0);

//     return NextResponse.json({
//       success: true,
//       evaluationScore: totalScore,
//       evaluationReport,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY})

export async function GET(req, context){
    try{
      const params = await context.params;
      const { interviewId, userId } = params;

      // Authentication check
      const {userId: authUserId} = getAuth(req);
      if(!authUserId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
      }

      console.log("Evaluating interview : ", interviewId, "for user", userId);

      // fetch interview questions and expected answers
      const interview = await db.select().from(mockInterview).where(eq(mockInterview.id, interviewId));

      if(!interview.length){
        return NextResponse.json({error: "Interview not found"}, {status: 404});
      }

      // fetch user answers
      const answers = await db.select().from(userAnswers).where(and(eq(userAnswers.interviewId, interviewId),eq(userAnswers.userId, userId)));

      if(!answers.length){
        return NextResponse.json({error: "No answers found"}, {status: 404});
      }

      // const questions = JSON.parse(interview[0].jsonMockResp);
      let questions;
      const raw = interview[0].jsonMockResp;

      if (typeof raw === "string") {
        try {
          questions = JSON.parse(raw);
        } catch (e) {
          console.error("Invalid JSON in jsonMockResp:", raw);
          questions = [];
        }
      } else {
        questions = raw;
      }

      // console.log('Questions:', questions);
      // console.log('User Answer Index:', userAnswers.questionIndex);

      const evaluationResults = [];
      let totalScore = 0;

      // Evaluate each answer using gemini
      for(let i = 0;i<answers.length;i++){
        const userAnswer = answers[i];
        const expectedQuestion = questions[i];

        if(!expectedQuestion) continue;

        const evaluationPrompt = `
          You are an expert technical interview evaluator. Evaluate the candidate's answer against the expected answer.

INTERVIEW CONTEXT:
- Job Position: ${interview[0].jobPosition}
- Job Description: ${interview[0].jobDesc}
- Experience Level: ${interview[0].jobExperience} years

QUESTION: ${expectedQuestion.question}

EXPECTED ANSWER: ${expectedQuestion.answer}

CANDIDATE'S ANSWER: ${userAnswer.answerText}

EVALUATION RULES:
You are an expert interviewer evaluating answers strictly. Score each category (Technical Accuracy, Completeness, Clarity, Relevance) out of 25.

STRICT RULES:
1. If the answer is irrelevant or nonsense, score 0 in that category.
2. Deduct at least 5 points for each missing key point in technical accuracy.
3. Do not give points for vague words like "hope", "maybe", "think", "kind of".
4. Only award points if the candidate demonstrates understanding.
5. Total score = sum of 4 categories, out of 100.

Always provide JSON ONLY, example:
{
  "technicalAccuracy": 0,
  "completeness": 0,
  "clarity": 0,
  "relevance": 0,
  "totalScore": 0,
  "feedback": "The answer is incorrect or irrelevant. No key points addressed.",
  "keyPoints": [],
  "suggestions": ["Provide accurate and complete answers", "Avoid vague statements"]
}
          `;

          try{
            const response = await ai.models.generateContent({
              model: 'gemini-2.0-flash-001',
              contents: evaluationPrompt,
            });

            let content = response?.candidates?.[0]?.content?.parts?.[0] || response?.output_text;

            if(typeof content !== "string"){
              content = content.text || JSON.stringify(content);
            }

            console.log("Gemini raw content:", JSON.stringify(content, null, 2));


            const cleanedContent = content.replace(/```json|```/g, '').trim();
            let evaluation;

            try {
              if (cleanedContent.startsWith("{") && cleanedContent.endsWith("}")) {
                evaluation = JSON.parse(cleanedContent);
              } else {
                throw new Error("Not valid JSON from Gemini");
              }
            } catch (parseError) {
              // Fallback evaluation if JSON parsing fails
              evaluation = {
                technicalAccuracy: 15,
                completeness: 15,
                clarity: 15,
                relevance: 15,
                totalScore: 60,
                feedback: "Unable to parse detailed evaluation. Please review your answer.",
                keyPoints: ["Answer provided but needs more detail"],
                suggestions: ["Provide more specific examples", "Elaborate on key concepts"]
              };
            }

            const questionEvaluation = {
              question: expectedQuestion.question,
              userAnswer: userAnswer.answerText,
              expectedAnswer: expectedQuestion.answer,
              evaluation: evaluation,
              timestamp: userAnswer.createdAt
            };


            

            evaluationResults.push(questionEvaluation);
            totalScore += evaluation.totalScore;

          }catch(error){
              console.error(`Error evaluating question ${i}:`, error);
        
        // Fallback evaluation for errors
        const fallbackEvaluation = {
            question: expectedQuestion.question,
            userAnswer: userAnswer.answerText,
            expectedAnswer: expectedQuestion.answer,
            evaluation: {
              technicalAccuracy: 10,
              completeness: 10,
              clarity: 10,
              relevance: 10,
              totalScore: 40,
              feedback: "Error occurred during evaluation. Manual review recommended.",
              keyPoints: ["Technical evaluation error"],
              suggestions: ["Please retry evaluation"]
            },
            timestamp: userAnswer.createdAt
          };
          
          evaluationResults.push(fallbackEvaluation);
          totalScore += 40;
          }
      }

      const averageScore = Math.round(totalScore / evaluationResults.length);
      const overallGrade = getGrade(averageScore);
      const interviewSummary = generateInterviewSummary(evaluationResults, averageScore);

      const finalEvaluation = {
        interviewId,
        userId,
        jobPosition: interview[0].jobPosition,
        totalQuestions: evaluationResults.length,
        averageScore,
        overallGrade,
        evaluationResults,
        interviewSummary,
        evaluatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        evaluation: finalEvaluation
      });

    }catch(error){
      console.error("Error in evaluation:", error);
      return NextResponse.json({
        error: error.message || "Failed to evaluate interview"
      }, { status: 500 });
    }
}

function getGrade(score) {
  if (score >= 90) return { grade: 'A+', description: 'Excellent' };
  if (score >= 80) return { grade: 'A', description: 'Very Good' };
  if (score >= 70) return { grade: 'B+', description: 'Good' };
  if (score >= 60) return { grade: 'B', description: 'Satisfactory' };
  if (score >= 50) return { grade: 'C', description: 'Needs Improvement' };
  return { grade: 'D', description: 'Poor' };
}

function generateInterviewSummary(results, averageScore) {
  const strengths = [];
  const improvements = [];
  let totalTechnical = 0;
  let totalClarity = 0;
  let totalCompleteness = 0;
  let totalRelevance = 0;

  results.forEach(result => {
    const eva = result.evaluation;
    totalTechnical += eva.technicalAccuracy || 0;
    totalClarity += eva.clarity || 0;
    totalCompleteness += eva.completeness || 0;
    totalRelevance += eva.relevance || 0;
  });

  const avgTechnical = totalTechnical / results.length;
  const avgClarity = totalClarity / results.length;
  const avgCompleteness = totalCompleteness / results.length;
  const avgRelevance = totalRelevance / results.length;

  // Identify strengths and areas for improvement
  if (avgTechnical >= 20) strengths.push("Strong technical knowledge");
  else improvements.push("Technical accuracy needs improvement");

  if (avgClarity >= 20) strengths.push("Clear communication skills");
  else improvements.push("Work on explanation clarity");

  if (avgCompleteness >= 20) strengths.push("Comprehensive answers");
  else improvements.push("Provide more complete responses");

  if (avgRelevance >= 20) strengths.push("Stays on topic well");
  else improvements.push("Focus more on question relevance");

  return {
    overallPerformance: averageScore >= 70 ? "Good performance" : "Needs improvement",
    strengths,
    areasForImprovement: improvements,
    categoryScores: {
      technical: Math.round(avgTechnical),
      clarity: Math.round(avgClarity),
      completeness: Math.round(avgCompleteness),
      relevance: Math.round(avgRelevance)
    }
  };
}
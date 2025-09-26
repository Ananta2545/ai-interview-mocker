import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";
import { db } from '../../../utils/db.js';
import { mockInterview } from '../../../utils/schema.js';
import {v4 as uuidV4} from "uuid"
import { auth, getAuth } from '@clerk/nextjs/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { jobPosition, jobDesc, jobExperiance } = await req.json();

    const {userId} = getAuth(req);
    console.log("userId from Clerk:", userId);
    if(!userId){
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const prompt = `You are an AI interviewer. Conduct a job interview for the role of ${jobPosition}.
Job Description: ${jobDesc}
Candidate Experience: ${jobExperiance} years
Provide exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} distinct interview questions in JSON format.
Each question should have the following structure:
{
  "question": "Your question here",
  "answer": "Sample answer here"
}
Return only valid JSON, do not include any extra text or formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    // Extract content
    let content = response?.candidates?.[0]?.content?.parts?.[0] || response?.output_text;

    if (!content) content = "[]";

    let questions;

    if (typeof content === "string") {
      // Remove markdown fences
      content = content.replace(/^```json\s*/, "").replace(/```$/, "").trim();
      // Parse string
      questions = JSON.parse(content);
    } else {
      // Already an object
      questions = content;
    }

    // Ensure it’s an array
    if (!Array.isArray(questions)) {
      // If it has a "text" key with JSON string, parse it
      if (questions.text) {
        questions = JSON.parse(questions.text.replace(/^```json\s*/, "").replace(/```$/, "").trim());
      } else {
        // Otherwise wrap in array
        questions = [questions];
      }
    }

    // Map to desired structure
    questions = questions.map(q => ({
      question: q.question,
      answer: q.answer
    }));

    // save to db
    const mockId = uuidV4();

    const savedInterview = await db.insert(mockInterview)
        .values({
            userId,
            jsonMockResp: JSON.stringify(questions),
            jobPosition, 
            jobDesc,
            jobExperience: Number(jobExperiance),
            createdBy: userId,
            mockId,
        })
        .returning(); // <-- returns the inserted row

        return NextResponse.json({
        success: true,
        savedInterview, // now you have all saved fields
        });


  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({
      error: error.message || "Something went wrong"
    }, { status: 500 });
  }
}

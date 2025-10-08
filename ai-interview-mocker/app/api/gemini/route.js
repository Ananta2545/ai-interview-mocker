import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";
import { db } from '../../../utils/db.js';
import { mockInterview } from '../../../utils/schema.js';
import {v4 as uuidV4} from "uuid"
import { auth, getAuth } from '@clerk/nextjs/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to call Gemini API with retry logic
async function generateContentWithRetry(prompt, retries = MAX_RETRIES) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🤖 Gemini API attempt ${attempt}/${retries}...`);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });
      
      console.log(`✅ Gemini API successful on attempt ${attempt}`);
      return response;
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Gemini API attempt ${attempt} failed:`, error.message);
      
      // Check if it's an overload error (503)
      const isOverloaded = error.message?.includes('overloaded') || 
                          error.message?.includes('503') ||
                          error.status === 503;
      
      // Check if it's a rate limit error (429)
      const isRateLimit = error.message?.includes('rate limit') || 
                         error.message?.includes('429') ||
                         error.status === 429;
      
      // Only retry on overload or rate limit errors
      if ((isOverloaded || isRateLimit) && attempt < retries) {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delayMs = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying in ${delayMs}ms...`);
        await wait(delayMs);
        continue;
      }
      
      // For other errors or final attempt, throw immediately
      throw error;
    }
  }
  
  // If we get here, all retries failed
  throw lastError;
}

export async function POST(req) {
  try {
    const { jobPosition, jobDesc, jobExperiance } = await req.json();

    const {userId} = getAuth(req);
    console.log("userId from Clerk:", userId);
    if(!userId){
        return NextResponse.json({ 
          error: "User not authenticated",
          errorType: "AUTH_ERROR" 
        }, { status: 401 });
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

    console.log(`🚀 Starting Gemini API call for ${jobPosition}...`);
    
    // Use retry logic
    const response = await generateContentWithRetry(prompt);

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
    console.error("❌ Error generating interview questions:", error);
    
    // Determine error type and provide user-friendly message
    let errorMessage = "Something went wrong";
    let errorType = "UNKNOWN_ERROR";
    let statusCode = 500;
    let userMessage = "An unexpected error occurred. Please try again.";
    
    // Check for specific error types
    if (error.message?.includes('overloaded') || error.message?.includes('503') || error.status === 503) {
      errorType = "MODEL_OVERLOADED";
      statusCode = 503;
      userMessage = "🤖 The AI model is currently overloaded. We tried multiple times but couldn't generate questions. Please try again in a few moments.";
      errorMessage = "Gemini API is overloaded";
    } 
    else if (error.message?.includes('rate limit') || error.message?.includes('429') || error.status === 429) {
      errorType = "RATE_LIMIT";
      statusCode = 429;
      userMessage = "⏳ Too many requests. Please wait a moment and try again.";
      errorMessage = "Rate limit exceeded";
    }
    else if (error.message?.includes('API key') || error.message?.includes('authentication') || error.status === 401) {
      errorType = "API_KEY_ERROR";
      statusCode = 500; // Don't expose API key issues to client
      userMessage = "⚠️ Configuration error. Please contact support.";
      errorMessage = "API authentication failed";
    }
    else if (error.message?.includes('network') || error.message?.includes('ECONNREFUSED')) {
      errorType = "NETWORK_ERROR";
      statusCode = 503;
      userMessage = "🌐 Network error. Please check your connection and try again.";
      errorMessage = "Network connection failed";
    }
    else if (error.message?.includes('timeout')) {
      errorType = "TIMEOUT_ERROR";
      statusCode = 504;
      userMessage = "⏱️ Request timed out. The AI is taking too long to respond. Please try again.";
      errorMessage = "Request timeout";
    }
    else {
      // Generic error
      userMessage = `❌ ${error.message || "Failed to generate interview questions. Please try again."}`;
      errorMessage = error.message || "Unknown error occurred";
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorType: errorType,
      userMessage: userMessage,
      // Include original error in development
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.toString(),
        stack: error.stack 
      })
    }, { status: statusCode });
  }
}

import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";
import { db } from '../../../utils/db.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { transcribedText, interviewId, questionId } = await req.json();


    // Validate required fields
    if (!transcribedText || !interviewId || !questionId) {
        return NextResponse.json({ 
            error: "Missing required fields: transcribedText, interviewId, questionId" 
        }, { status: 400 });
    }

    const prompt = `You are a spelling correction tool. Your ONLY task is to fix misspelled words in the given text. 

STRICT RULES:
1. Correct any spelling mistakes.
2. Detect obvious mispronunciations of technical words and convert them to the correct technical terms (e.g., "nexus" → "Next.js", "reacts" → "React", "nodej" → "Node.js", "mongo db" → "MongoDB").
3. Do NOT remove any words.
4. Preserve the original grammar and sentence structure as much as possible.
5. Add punctuation if it improves readability.
6. Avoid adding extra explanatory words, but minor adjustments for clarity are allowed.
7. Return the text with minimal changes, keeping the original meaning intact.
8. If the text is mostly correct, return it unchanged.
9. Prioritize technical accuracy: always replace general or mispronounced words with the correct technical terminology where appropriate.

Text to correct: "${transcribedText}"

Return only the corrected text, no extra formatting or explanation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    // Extract content
    let content = response?.candidates?.[0]?.content?.parts?.[0] || response?.output_text;

    if (!content) content = transcribedText; // fallback to original text

    let correctedText;

    if (typeof content === "string") {
      correctedText = content.trim();
    } else {
      // If it has a "text" key, use it
      correctedText = content.text ? content.text.trim() : transcribedText;
    }

    return NextResponse.json({
        success: true,
        originalText: transcribedText,
        correctedText,
    });

  } catch (error) {
    console.error("Error correcting spelling:", error);
    return NextResponse.json({
      error: error.message || "Something went wrong with spelling correction"
    }, { status: 500 });
  }
}
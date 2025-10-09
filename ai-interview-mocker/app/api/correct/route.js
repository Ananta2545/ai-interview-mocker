import { GoogleGenAI } from '@google/genai';
import { NextResponse } from "next/server";
import { db } from '../../../utils/db.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Model priority: Use only working free models (verified to exist in API)
// These models are free and have generous quota limits
const GEMINI_MODELS = [
  'gemini-2.0-flash-exp',      // Latest experimental - very fast and free
  'gemini-1.5-flash-latest',   // Latest stable flash - fast and reliable
  'gemini-1.5-pro-latest',     // Latest stable pro - better quality
  'gemini-exp-1206',           // Experimental model - good fallback
];

/**
 * Retry logic with multiple Gemini models
 * Tries each model in sequence until one succeeds
 */
async function correctTextWithRetry(prompt, maxRetries = GEMINI_MODELS.length) {
  let lastError = null;
  
  for (let i = 0; i < Math.min(maxRetries, GEMINI_MODELS.length); i++) {
    const model = GEMINI_MODELS[i];
    
    try {
      console.log(`🔄 Attempting with model: ${model} (attempt ${i + 1}/${maxRetries})`);
      
      const response = await Promise.race([
        ai.models.generateContent({
          model: model,
          contents: prompt,
        }),
        // Timeout after 15 seconds to try next model (increased for better reliability)
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]);

      // Extract content
      let content = response?.candidates?.[0]?.content?.parts?.[0] || response?.output_text;

      if (content) {
        let correctedText;
        
        if (typeof content === "string") {
          correctedText = content.trim();
        } else {
          correctedText = content.text ? content.text.trim() : null;
        }

        if (correctedText) {
          console.log(`✅ Success with model: ${model}`);
          return { correctedText, modelUsed: model };
        }
      }
      
      throw new Error('Invalid response format');
      
    } catch (error) {
      // Extract meaningful error message
      const errorMsg = error.message || JSON.stringify(error);
      console.error(`❌ Model ${model} failed:`, errorMsg);
      lastError = error;
      
      // If it's a quota error (429), skip to next model immediately
      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        console.log(`⚠️ Quota exceeded for ${model}, trying next model...`);
      }
      
      // If not the last model, continue to next one
      if (i < Math.min(maxRetries, GEMINI_MODELS.length) - 1) {
        console.log(`🔄 Retrying with next model...`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between retries
        continue;
      }
    }
  }
  
  // All models failed
  throw lastError || new Error('All models failed to generate response');
}

export async function POST(req) {
  let transcribedText, interviewId, questionId;
  
  try {
    // Parse request body once at the beginning
    const body = await req.json();
    transcribedText = body.transcribedText;
    interviewId = body.interviewId;
    questionId = body.questionId;

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

    // Try with retry logic across multiple models
    const { correctedText, modelUsed } = await correctTextWithRetry(prompt);

    return NextResponse.json({
        success: true,
        originalText: transcribedText,
        correctedText,
        modelUsed, // Return which model succeeded for debugging
    });

  } catch (error) {
    console.error("❌ Error correcting spelling (all retries failed):", error.message || error);
    
    // Graceful degradation - return original text if all models fail
    // Don't try to parse body again - use the already parsed transcribedText
    return NextResponse.json({
      success: true, // Still return success to not break the flow
      originalText: transcribedText || '',
      correctedText: transcribedText || '', // Use original text as fallback
      modelUsed: 'none',
      fallback: true,
      error: error.message || 'Unknown error occurred'
    });
  }
}
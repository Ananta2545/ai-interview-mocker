import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../utils/db';
import { quizQuestions, quizzes } from '../../../../utils/schema';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { userId, numQuestions, topic, level, timeLimit } = await req.json();

    
    const {userId: authenticatedUserId} = await auth();

    if(!authenticatedUserId){
      console.log("Unauthorized access");
      return NextResponse.json({error: "Unauthorized please sign in"}, {status: 401})
    }
    console.log("Authenticated user: ", authenticatedUserId);

    if (!userId || !numQuestions || !topic || !level || !timeLimit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if(userId !== authenticatedUserId){
      console.log("User mismatch", {provided: userId, authenticated: authenticatedUserId});
      return NextResponse.json({error: "Forbidded - user mismatch"}, {status: 403});
    }

    // Step 1: Create parent quiz row
    const [quiz] = await db.insert(quizzes).values({
      userId,
      topic,
      level,
      questionCount: numQuestions, // initially set
      timeLimit: timeLimit || 60,
    }).returning({ id: quizzes.id, timeLimit: quizzes.timeLimit });

    // Step 2: Prompt Gemini for questions
    const prompt = `
Generate ${numQuestions} multiple-choice questions (MCQ) on the topic "${topic}" with difficulty level "${level}".
- Each question should have exactly 4 options.
- Format ONLY as a JSON array without any extra text, markdown, or code blocks.
- Use the keys: "question", "options", "correctAnswer".
Example format:
[
  {
    "question": "Your question here",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    // Step 3: Extract and clean response
    let content = response?.candidates?.[0]?.content?.parts?.[0] || response?.output_text;

    if (typeof content === 'object' && content?.text) {
      content = content.text;
    }
    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'AI response is not a string' }, { status: 500 });
    }

    content = content.replace(/```json|```/g, '').trim();

    let questions;
    try {
      const match = content.match(/\[.*\]/s);
      if (!match) throw new Error('No valid JSON array found in AI response');
      questions = JSON.parse(match[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      return NextResponse.json({ error: 'Failed to parse AI-generated questions' }, { status: 500 });
    }

    // Step 4: Save questions with quizId
    for (const q of questions) {
      await db.insert(quizQuestions).values({
        quizId: quiz.id, // link to quiz
        userId,
        questionText: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      });
    }

    // Step 5: Return quizId and questions
    return NextResponse.json({ success: true, quizId: quiz.id, questions, timeLimit: quiz.timeLimit });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Server down' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { unitsData } from '@/lib/data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { mode, unit, question, studentAnswer, expectedAnswer } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const unitData = unitsData[unit];
    if (!unitData) {
      return NextResponse.json(
        { error: 'Invalid unit' },
        { status: 400 }
      );
    }

    // MODE 1: Alex asks, Student answers (Check accuracy)
    if (mode === 'alex_ask') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content: `You are Alex, a friendly English teacher for grade 5 Vietnamese students. Your job is to check if the student's answer is correct and provide encouraging feedback.

Consider the following when checking:
- Grammar mistakes are acceptable if the meaning is clear
- Missing small words (a, the, is) are OK if key concepts are present
- Pronunciation variations in text form are acceptable
- Vietnamese students learning English may make common mistakes

Be encouraging and positive! Always praise effort.`
          },
          {
            role: 'user',
            content: `Question asked: "${question}"
Expected answer: "${expectedAnswer}"
Student said: "${studentAnswer}"

Please evaluate if the student's answer is correct or close enough. Return your response in JSON format:
{
  "correct": true or false,
  "feedback": "encouraging message",
  "correctedAnswer": "the exact correct answer (only if wrong)"
}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return NextResponse.json(result);
    }

    // MODE 2: Student asks, AI answers
    if (mode === 'stu_ask') {
      const qaContext = unitData.qa.map(item =>
        `Q: ${item.q}\nA: ${item.a}`
      ).join('\n\n');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Alex, a friendly 10-year-old student in class 5/1. You are practicing English with Vietnamese students.

Answer questions about Unit ${unit}: ${unitData.n}

Use this knowledge to answer:
${qaContext}

Keep your answers:
- Simple and clear (you're 10 years old!)
- Friendly and encouraging
- Based on the context provided
- In proper English grammar

If the question is about you personally (your name, age, class), use:
- Name: Alex
- Age: 10 years old
- Class: 5/1`
          },
          {
            role: 'user',
            content: studentAnswer
          }
        ],
        temperature: 0.8,
      });

      const aiAnswer = completion.choices[0].message.content || "I'm not sure. Can you ask me something else?";

      return NextResponse.json({
        aiAnswer,
        feedback: "Great question!",
        correct: true
      });
    }

    return NextResponse.json(
      { error: 'Invalid mode' },
      { status: 400 }
    );

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

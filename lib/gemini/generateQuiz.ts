"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "crypto";
import {
    GenerateQuizParams,
    Question,
    Option,
} from "@/lib/types";
import { DIFFICULTIES, TOPICS, TIME_LIMITS } from "../tags";


type GeminiQuizResponse = {
    name: string;
    questions: Question[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    },
});

const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 50;
const MAX_ATTEMPTS = 5;

export async function generateQuiz(
    params: GenerateQuizParams
): Promise<{ data?: GeminiQuizResponse; error?: string }> {

    const { topics, difficulty, questionCount, timeLimit } = params;

    try {

        let numQuestions: number;
        if (typeof questionCount === "number") {
            if (questionCount < MIN_QUESTIONS || questionCount > MAX_QUESTIONS) {
                return {
                    error: `Custom question count must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}.`
                };
            }
            numQuestions = questionCount;
        } else {
            numQuestions = parseInt(questionCount.replace("q", ""), 10);
        }


        const topicLabels = topics
            .map(t => TOPICS.find(topic => topic.value === t)?.label || t)
            .join(", ");

        const difficultyLabel =
            DIFFICULTIES.find((d) => d.value === difficulty)?.label || difficulty;

        const timeLimitLabel =
            TIME_LIMITS.find((t) => t.value === timeLimit)?.label || timeLimit;


        const initialPrompt = `
      Generate a quiz based on the following parameters:
      - Topics: "${topicLabels}"
      - Difficulty: "${difficultyLabel}"
      - Number of Questions: ${numQuestions}
      - Time Limit: "${timeLimitLabel}" (This is for quiz context, just generate the questions)

      Your response MUST be a valid JSON object.
      The root object must have two keys:
      1. "name": A creative and descriptive quiz title. It should be based on the topics "${topicLabels}" and the difficulty "${difficultyLabel}". (e.g., "${difficultyLabel} ${topicLabels}        Assessment", "${topicLabels} Fundamentals", "Advanced ${topicLabels} Challenge")
      2. "questions": An array of question objects.

      Each object in the "questions" array MUST have this exact structure:
      {
        "question": "The question text as a string",
        "options": [
          { "option": "Option text 1", "correct": boolean },
          { "option": "Option text 2", "correct": boolean },
          { "option": "Option text 3", "correct": boolean },
          { "option": "Option text 4", "correct": boolean }
        ],
        "explanation": "A brief explanation for the correct answer."
      }

      RULES:
      - Attempt to generate exactly ${numQuestions} questions.
      - Every question must have exactly 4 options.
      - Exactly ONE option in each "options" array must have "correct: true".
    `;


        const result = await model.generateContent(initialPrompt);
        const response = result.response;
        const jsonText = response.text();


        const generatedQuiz: GeminiQuizResponse = JSON.parse(jsonText);

        if (generatedQuiz.questions.length > numQuestions) {
            console.log(`AI returned ${generatedQuiz.questions.length} questions, slicing to ${numQuestions}.`);
            generatedQuiz.questions = generatedQuiz.questions.slice(0, numQuestions);
        }


        let attempts = 0;
        while (generatedQuiz.questions.length < numQuestions && attempts < MAX_ATTEMPTS) {
            const questionsNeeded = numQuestions - generatedQuiz.questions.length;
            console.log(`AI returned ${generatedQuiz.questions.length} questions, needing ${questionsNeeded} more.`);

            attempts++;


            const followUpPrompt = `
          You are generating supplemental questions for a quiz on "${topicLabels}" at ${difficultyLabel} difficulty.
          The quiz is missing ${questionsNeeded} questions.

          Your response MUST be a valid JSON array containing exactly ${questionsNeeded} question objects.
          Do NOT return a root object with "name". Just return the array: [ ... ]

          Each object in the array MUST have this exact structure:
          {
            "question": "The question text as a string",
            "options": [
              { "option": "Option text 1", "correct": boolean },
              { "option": "Option text 2", "correct": boolean },
              { "option": "Option text 3", "correct": boolean },
              { "option": "Option text 4", "correct": boolean }
            ],
            "explanation": "A brief explanation."
          }
          
          RULES:
          - The array must contain exactly ${questionsNeeded} items.
          - Exactly ONE option must be "correct: true".
        `;

            const followUpResult = await model.generateContent(followUpPrompt);
            const followUpResponse = followUpResult.response;
            const followUpJsonText = followUpResponse.text();

            try {

                const newAiQuestions = JSON.parse(followUpJsonText) as Question[]

                if (newAiQuestions && newAiQuestions.length > 0) {
                    const questionsToAdd = newAiQuestions.slice(0, questionsNeeded);
                    generatedQuiz.questions = generatedQuiz.questions.concat(questionsToAdd);
                } else {
                    throw new Error("AI returned no new questions in follow-up.");
                }
            } catch (parseError) {
                console.error("Failed to parse follow-up AI response:", followUpJsonText, parseError);
                throw new Error("AI returned invalid JSON in follow-up.");
            }
        }


        if (generatedQuiz.questions.length !== numQuestions) {
            throw new Error(`Failed to generate required ${numQuestions} questions after ${attempts} attempts. Got ${generatedQuiz.questions.length}.`);
        }

        const finalQuestions: Question[] = generatedQuiz.questions.map((aiQ): Question => ({
            ...aiQ,
            id: randomUUID(),
            skip: false,
            options: aiQ.options.map((aiOpt): Option => ({
                ...aiOpt,
                id: randomUUID(),
                userSelected: null
            })),
            explanation: aiQ.explanation,
        }));


        const quizData = {
            name: generatedQuiz.name,
            questions: finalQuestions,
        };

        return { data: quizData };

    } catch (e) {
        console.error("Error generating quiz:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        throw new Error(`Failed to generate the quiz: ${errorMessage}. Please try again.`)
    }
}
"use server"

import { generateQuiz } from "@/lib/gemini/generateQuiz";
import prisma from "@/lib/prisma";
import { getSession } from "./getSession";

export async function createQuiz(): Promise<string> {
    const quizJson = await generateQuiz();
    const { user } = await getSession();
    const quiz = await prisma.quiz.create({
        data: {
            name: quizJson.name,
            creatorId: user.id,
            questions: quizJson.questions,
            timeLimit: 3600

        }
    })
    return quiz.id;
}
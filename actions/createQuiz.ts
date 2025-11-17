"use server"

import { generateQuiz } from "@/lib/gemini/generateQuiz";
import prisma from "@/lib/prisma";
import { getSession } from "./getSession";
import { GenerateQuizParams, TimeLimit } from "@/lib/types";

function convertTimeLimitToSeconds(timeLimit: TimeLimit): number {

    const minutes = parseInt(timeLimit.replace("m", ""), 10);
    if (isNaN(minutes)) {
        return 3600;
    }
    return minutes * 60;
}

export async function createQuiz(params: GenerateQuizParams): Promise<string> {
    const { user } = await getSession();

    const quizResult = await generateQuiz(params);

    if (quizResult.error) {
        throw new Error(quizResult.error);
    }

    if (!quizResult.data) {
        throw new Error("Failed to generate quiz data.");
    }

    const timeLimitInSeconds = convertTimeLimitToSeconds(params.timeLimit);

    const quiz = await prisma.quiz.create({
        data: {
            name: quizResult.data.name,
            creatorId: user.id,
            questions: quizResult.data.questions,
            timeLimit: timeLimitInSeconds
        }
    })
    return quiz.id;
}
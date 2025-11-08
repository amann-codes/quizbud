"use server"

import { Quiz } from "@/lib/types";
import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function getQuiz(id: string): Promise<Quiz> {
    try {
        if (!id) {
            throw new Error('Id is required to start a quiz')
        }
        await getSession();
        const quiz = await prisma.quiz.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                questions: true,
                name: true,
                timeLimit: true,
                creator: true,
            }
        })
        if (!quiz) {
            throw new Error(`Quiz was not created: ${quiz}`)

        }
        return quiz as Quiz;
    } catch (e) {
        throw new Error(`Error occurred getting quiz data: ${e}`)
    }
}
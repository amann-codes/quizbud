"use server"

import { GetQuizActionResult } from "@/lib/types";
import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function getQuiz(id: string): Promise<GetQuizActionResult> {
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
                name: true,
                questions: {
                    select: {
                        id: true
                    }
                },
                timeLimit: true,
                expect: true,
                creator: {
                    select: {
                        name: true
                    }
                },
            }
        })
        if (!quiz) {
            throw new Error(`Quiz was not created: ${quiz}`)

        }
        return {
            ...quiz,
            questions: quiz.questions.length
        } as GetQuizActionResult
    } catch (e) {
        throw new Error(`Error occurred getting quiz data: ${e}`)
    }
}
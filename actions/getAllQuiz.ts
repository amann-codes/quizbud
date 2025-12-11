"use server"

import { GetAllQuizActionResult } from "@/lib/types";
import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function getAllQuiz(): Promise<GetAllQuizActionResult[]> {
    try {
        const { user } = await getSession();
        const quiz = await prisma.quiz.findMany({
            where: {
                creatorId: user.id,
            }, orderBy: {
                createdAt: "desc"
            }, select: {
                name: true,
                id: true,
                timeLimit: true,
                questions: {
                    select: {
                        id: true,
                    }
                }
            }
        })
        if (!quiz) {
            throw new Error(`No quiz found: ${quiz}`)
        }
        return quiz.map((q) => ({
            ...q,
            questions: q.questions.length
        }))
    } catch (e) {
        console.log(`Error at getAllQuiz: ${e}`)
        throw new Error(`Error occured getting your quizzees: ${e}`)
    }
}
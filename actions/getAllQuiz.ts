"use server"

import { getSession } from "./getSession"

export async function getAllQuiz() {
    try {
        const { user } = await getSession();
        const quiz = await prisma.quiz.findMany({
            where: {
                creatorId: user.id
            }
        })
        if (!quiz) {
            throw new Error(`No quiz found: ${quiz}`)
        }
        return quiz
    } catch (e) {
        throw new Error(`Error occured getting your quizzees: ${e}`)
    }
}
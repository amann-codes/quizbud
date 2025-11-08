"use server"

import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function createTest(id: string) {
    try {
        if (!id) {
            throw new Error('Quiz Id is required to start the test')
        }
        const { user } = await getSession();
        const quiz = await prisma.quiz.findUnique({ where: { id } });
        if (!quiz) {
            throw new Error(`Quiz not found: ${quiz}`)
        }
        const test = await prisma.test.create({
            data: {
                questions: quiz.questions,
                timeLimit: quiz.timeLimit,
                userId: user.id,
                quizId: quiz.id,
            }
        })
        if (!test) {
            throw new Error(`Test was not craeted: ${test}`)
        }
        return test.id
    } catch (e) {
        throw new Error(`Error occured starting the test: ${e}`)
    }
}
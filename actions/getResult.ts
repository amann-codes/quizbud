"use server"

import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function getResult(testId: string) {
    try {
        if (!testId) {
            throw new Error(`Id is required to get result: ${testId}`)
        }
        const session = await getSession();
        const result = await prisma.test.findUnique({
            where: {
                id: testId,
                AND: [
                    { userId: session.user.id },
                    { testStatus: "COMPLETED" }
                ]
            },
            select: {
                quiz: {
                    select: {
                        creator: {
                            select: {
                                name: true
                            }
                        },
                        name: true
                    },
                },
                questions: {
                    select: {
                        id: true,
                        explanation: true,
                        options: {
                            select: {
                                id: true,
                                userSelected: true,
                                correct: true,
                                option: true,
                            }
                        },
                        question: true,
                        skip: true
                    }
                }
            }
        })
        if (!result) {
            console.log(`Error getting result data: ${result}`)
            throw new Error(`Error getting result data: ${result}`)
        }
        const correct = result?.questions.filter((q) => q.options.some((o) => o.userSelected && o.correct));
        const incorrect = result?.questions.filter((q) => q.options.some((o) => o.userSelected && !o.correct))
        const notAnswered = result?.questions.filter(
            (q) =>
                q.skip === false &&
                !q.options.some(o => o.userSelected === true)
        )
        const skipped = result?.questions.filter((q) => q.skip == true);
        const creator = result?.quiz.creator.name;
        const quizName = result?.quiz.name;
        return {
            correct: correct ?? [],
            incorrect: incorrect ?? [],
            skipped: skipped ?? [],
            notAnswered: notAnswered ?? [],
            quizName: quizName ?? "",
            creator: creator ?? ""
        }


    } catch (e) {
        console.log(`Error gettin your result: ${e}`)
        throw new Error(`Error getting your result: ${e}`)
    }
}
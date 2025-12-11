"use server"

import { GetAllTestActionResult } from "@/lib/types";
import { getSession } from "./getSession";
import prisma from "@/lib/prisma";



export async function getAllTest(): Promise<GetAllTestActionResult[]> {
    try {
        const { user } = await getSession();
        const test = await prisma.test.findMany({
            where: {
                userId: user.id
            },
            select: {
                quiz: {
                    select: {
                        id: true,
                        name: true,
                        questions: {
                            select: {
                                id: true
                            }
                        },
                        creator: {
                            select: {
                                name: true
                            }
                        },
                        timeLimit: true
                    }
                },
                id: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (!test) {
            throw new Error(`No test found: ${test}`)
        }
        return test.map((t) => ({
            ...t,
            quiz: {
                ...t.quiz,
                questions: t.quiz.questions.length
            }
        })) as GetAllTestActionResult[]
    } catch (e) {
        throw new Error(`Error occured getting your tests: ${e}`)
    }
}


// id: string;
//     name: string;
//     timeLimit: number;
//     creator: {
//         id: string;
//         name: string | null;
//     };
//     questions: Question[];
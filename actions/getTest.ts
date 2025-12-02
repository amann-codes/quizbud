"use server"

import { Test } from "@/lib/types";
import { getSession } from "./getSession"
import prisma from "@/lib/prisma";

export async function getTest(id: string): Promise<Test> {
    try {
        if (!id) {
            throw new Error('Id is required to get a test')
        }
        const session = await getSession();
        const test = await prisma.test.findUnique({
            where: {
                id,
                AND: { userId: session.user.id }
            },
            select: {
                id: true,
                startedAt: true,
                testStatus: true,
                currentIndex: true,
                endedAt: true,
                quiz: {
                    select: {
                        name: true,
                        timeLimit: true
                    }
                },
                questions: {
                    select: {
                        id: true,
                        question: true,
                        explanation: false,
                        options: {
                            select: {
                                id: true,
                                option: true,
                                correct: false,
                                userSelected: true
                            },
                        },
                    },
                },
            },
        });
        if (!test) {
            throw new Error('test not found')
        }
        return test as Test;
    } catch (e) {
        throw new Error(`Error occurred getting test data :${e}`)
    }
}
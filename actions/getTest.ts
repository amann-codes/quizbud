"use server"

import { Test } from "@/lib/types";
import { getSession } from "./getSession"

export async function getTest(id: string): Promise<Test> {
    try {
        if (!id) {
            throw new Error('Id is required to get a test')
        }
        await getSession();
        const test = await prisma.test.findUnique({
            where: { id },
            select: {
                id: true,
                questions: {
                    select: {
                        id: true,
                        question: true,
                        explanation: true,
                        options: {
                            select: {
                                id: true,
                                option: true,
                                correct:true
                            },
                        },
                    },
                },
                timeLimit: true,
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
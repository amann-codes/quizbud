"use server"

import { getSession } from "./getSession";
import prisma from "@/lib/prisma";

export async function getAllTest() {
    try {
        const { user } = await getSession();
        const test = await prisma.test.findMany({
            where: {
                userId: user.id
            },
            select: {
                questions: true,
                quiz: {
                    select: {
                        id: true,
                        name: true,
                        creator: true
                    }
                },
                id: true,
                timeLimit: true
            }
        })
        if (!test) {
            throw new Error(`No test found: ${test}`)
        }
        return test
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
"use server"

import prisma from "@/lib/prisma"

export async function startTest({ id }: { id: string }) {
    try {
        const test = await prisma.test.update({
            where: { id },
            data: {
                testStatus: "IN_PROGRESS",
                startedAt: new Date()
            }
        })
        if (!test) {
            throw new Error(`Test not found for Id: ${id}`)
        }
        if (test.testStatus !== "IN_PROGRESS") {
            throw new Error('Test not Started');
        }
        return test
    } catch (e) {
        console.error(`Error occurred: ${e}`)
        throw new Error(`Error occurred: ${e}`)
    }
}
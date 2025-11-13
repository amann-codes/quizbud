"use server"

import { applyEventAndUpdatePayload } from "@/lib/applyEventAndUpdatePayload";
import prisma from "@/lib/prisma";
import { EventPayload, EventSchema } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const request = await req.json();
        console.log('request', request)
        const id = (await params).id;

        if (!id) throw new Error('ID IS REQUIRED TO UPDATE TEST');

        const payload: EventPayload = EventSchema.parse(request)

        await prisma.$transaction(async (tx) => {
            const event = await tx.testEvent.create({
                data: {
                    eventType: payload.eventType,
                    payload: {
                        ...payload,
                        serverTimestamp: new Date(),
                    },
                    testId: id,
                    idempotencyKey: payload.idempotencyKey,
                },
            });

            const test = await tx.test.findUnique({
                where: { id }, select: {
                    id: true,
                    startedAt: true,
                    testStatus: true,
                    questions: true,
                    currentIndex: true,
                    timeLimit: true,
                    quiz: {
                        select: {
                            name: true
                        }
                    },
                    endedAt: true
                }
            });
            if (!test) throw new Error(`TEST NOT FOUND WITH THE ID: ${id}`);

            const userUpdatedTest = applyEventAndUpdatePayload(test, payload);

            await tx.test.update({
                where: { id },
                data: userUpdatedTest,
            });

            await tx.testEvent.update({
                where: { id: event.id },
                data: { processed: true },
            });
        });

        return NextResponse.json({ message: "test updated" });

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: `ERROR OCCURRED UPDATING TEST: ${e}` },
            { status: 500 }
        );
    }
}

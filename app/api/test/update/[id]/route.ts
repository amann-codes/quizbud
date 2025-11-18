"use server"

import { applyEventAndUpdatePayload } from "@/lib/applyEventAndUpdatePayload";
import prisma from "@/lib/prisma";
import { EventPayload, EventSchema } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const request = await req.json();
        const id = (await params).id;

        if (!id) throw new Error('ID IS REQUIRED TO UPDATE TEST');

        const events: EventPayload[] = EventSchema.array().parse(request)

        const event = await prisma.testEvent.createMany({
            data: events.map((payload) => ({
                eventType: payload.eventType,
                clientTimeStamp: payload.clientTimestamp,
                serverTimeStamp: new Date(),
                payload: {
                    ...payload,
                },
                testId: id,
                idempotencyKey: payload.idempotencyKey,
            }))
        });
        await prisma.$transaction(async (tx) => {
            const test = await tx.test.findUnique({
                where: { id },
                select: {
                    id: true,
                    startedAt: true,
                    testStatus: true,
                    questions: true,
                    currentIndex: true,
                    timeLimit: true,
                    quiz: { select: { name: true } },
                    endedAt: true,
                }
            })

            if (!test) throw new Error("TEST NOT FOUND")
            if (test.testStatus === "COMPLETED") return

            const unprocessed = await tx.testEvent.findMany({
                where: {
                    testId: id,
                    processed: false
                },
                orderBy: { clientTimeStamp: "asc" }
            })

            let updated = test

            for (const evt of unprocessed) {
                const payload = EventSchema.parse(evt.payload)
                updated = applyEventAndUpdatePayload(updated, payload)
            }

            await tx.test.update({
                where: { id },
                data: {
                    questions: updated.questions,
                    currentIndex: updated.currentIndex,
                    testStatus: updated.testStatus,
                    endedAt: updated.endedAt
                }
            })

            await tx.testEvent.updateMany({
                where: {
                    id: { in: unprocessed.map(e => e.id) }
                },
                data: { processed: true }
            })
        })

        return NextResponse.json({ message: "test updated" });

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: `ERROR OCCURRED UPDATING TEST: ${e}` },
            { status: 500 }
        );
    }
}
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

        await prisma.$transaction(async (tx) => {

            const test = await tx.test.findUnique({
                where:
                    { id },
                select: {
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

            if (test.testStatus == "COMPLETED") {
                console.log("user updating after test completion")
                return;
            }

            const event = await tx.testEvent.createMany({
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

            const unprocessedEvents = await tx.testEvent.findMany({
                where: {
                    AND: {
                        testId: id,
                        processed: false
                    }
                }, orderBy: {
                    clientTimeStamp: "asc"
                },
            })


            let currentTest = test;

            for (const unprocessedEvent of unprocessedEvents) {
                const payload = EventSchema.parse(unprocessedEvent.payload);
                currentTest = applyEventAndUpdatePayload(currentTest, payload);
                await tx.testEvent.update({
                    where: {
                        id: unprocessedEvent.id
                    },
                    data: { processed: true }
                })
            }

            await tx.test.update({
                where: { id },
                data: {
                    questions: currentTest.questions,
                    currentIndex: currentTest.currentIndex,
                    testStatus: currentTest.testStatus,
                    endedAt: currentTest.endedAt,
                },
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

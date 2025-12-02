import { EventPayload, Test } from "./types";

export function applyEventAndUpdatePayload(test: Test, payload: EventPayload): Test {

    const event = payload.eventType;
    const updatedTest = structuredClone(test);
    switch (event) {
        case "SELECT": {
            if (!payload.optionId || !payload.questionId) break;

            updatedTest.questions = updatedTest.questions.map((q) => {
                if (q.id !== payload.questionId) return q;

                const optionExists = q.options.some((o) => o.id === payload.optionId);
                if (!optionExists) return q;
                return {
                    ...q,
                    skip: false,
                    options: q.options.map((o) =>
                    ({
                        ...o, userSelected: o.id === payload.optionId
                    }))
                }
            })
            break;
        }
        case "NAVIGATE": {
            updatedTest.currentIndex = payload.questionIndex;
            updatedTest.endedAt = payload.clientTimestamp;
            break;
        }
        case "SKIP": {
            if (!payload.questionId) break;
            updatedTest.questions = updatedTest.questions.map((q) =>
                q.id === payload.questionId
                    ? {
                        ...q,
                        skip: true,
                        options: q.options.map((o) => ({
                            ...o,
                            userSelected: false,
                        })),
                    }
                    : q
            );
            break;
        }
        case "SUBMIT": {
            updatedTest.testStatus = "COMPLETED"
            updatedTest.endedAt = payload.clientTimestamp
            updatedTest.currentIndex = payload.questionIndex
        }
        case "TIMEOUT": {
            updatedTest.testStatus = "COMPLETED";
            updatedTest.endedAt = payload.clientTimestamp;
            break;
        }
        case "HARDRESET": {
            updatedTest.questions = updatedTest.questions.map((q) => ({
                ...q,
                skip: false,
                options: q.options.map((o) => ({
                    ...o,
                    userSelected: null,
                })),
            }));
            updatedTest.currentIndex = 0;
            break;
        }
        case "RESET": {
            if (!payload.questionId) break;
            updatedTest.questions = updatedTest.questions.map((q) =>
                q.id === payload.questionId
                    ? {
                        ...q,
                        skip: false,
                        options: q.options.map((o) => ({
                            ...o,
                            userSelected: null
                        }))
                    } : q
            )
            break;
        }

    }
    return updatedTest
}
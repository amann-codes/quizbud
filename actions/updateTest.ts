"use server";

import { EventPayload } from "@/lib/types";

export async function updateTest({ payload, testId }: { payload: EventPayload, testId: string }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/test/update/${testId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update test");
        return await res.json();
    } catch (err) {
        console.error("Server action failed:", err);
        throw err;
    }
}

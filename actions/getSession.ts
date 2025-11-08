"use server";

import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import prisma from "@/lib/prisma";

interface AuthenticatedSession extends Session {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export async function getSession(): Promise<AuthenticatedSession> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    const userExists = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
    });
    if (!userExists) {
        throw new Error("User not found");
    }
    return session as AuthenticatedSession;
}
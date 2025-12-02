"use server"

import { getSession } from "./getSession";
import prisma from "@/lib/prisma"


export async function getUserStat() {
    try {
        const session = await getSession();
        const stat = await prisma.userStat.findUnique({
            where: {
                userId: session.user.id
            }
        })
        return stat
    } catch (e) {
        console.error(e);
        throw new Error(`${e}`)
    }
}
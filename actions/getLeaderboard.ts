"use server"

import prisma from "@/lib/prisma"

export async function getLeaderBoard() {
    const allStats = await prisma.userStat.findMany({
        orderBy: { score: "desc" },
        select: {
            id: true,
            userId: true,
            score: true,
            currentRank: true,
            prevRank: true,
            User: {
                select: { name: true },
            },
        },
    })

    const top10 = allStats.slice(0, 10)

    return top10.map((stat, index) => ({
        id: stat.id,
        name: stat.User?.name || "Anonymous User",
        score: Number(stat.score),
        currentRank: index + 1,
        previousRank: Number(stat.prevRank ?? stat.currentRank ?? index + 1),
    }))
}
"use server"

import prisma from "@/lib/prisma"

export async function getGlobalLeaderBoard() {
    try {
        const allStats = await prisma.userStat.findMany({
            orderBy: { score: "desc" },
            select: {
                id: true,
                userId: true,
                score: true,
                globalCurrentRank: true,
                gloablPrevRank: true,
                User: {
                    select: { name: true, image: true },
                },
            },
        })
        const top10 = allStats.slice(0, 10)

        return top10.map((stat, index) => ({
            id: stat.id,
            name: stat.User?.name || "Anonymous User",
            image: stat.User?.image || "",
            score: Number(stat.score),
            currentRank: index + 1,
            prevRank: Number(stat.gloablPrevRank ?? stat.globalCurrentRank ?? index + 1),
        }))

    } catch (e) {
        throw new Error(`Error occurred getting leaderboard`)
    }
}
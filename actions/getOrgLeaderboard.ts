"use server"

export async function getOrgLeaderboard({ org }: { org: string }) {
    try {
        const allStats = await prisma.userStat.findMany({
            where: {
                org
            },
            orderBy: { score: "desc" },
            select: {
                id: true,
                userId: true,
                score: true,
                orgCurrentRank: true,
                orgPrevRank: true,
                User: {
                    select: { name: true, image: true },
                },
            },
        })
        if (allStats.length === 0) {
            return []
        }

        const top10 = allStats.slice(0, 10)

        if (top10.length === 0) {
            return []
        }

        return top10.map((stat, index) => ({
        id: stat.id,
        name: stat.User?.name || "Anonymous User",
        image: stat.User?.image || "",
        score: Number(stat.score),
        currentRank: index + 1,
        prevRank: Number(stat.orgPrevRank ?? stat.orgCurrentRank ?? index + 1),
    }))

    } catch (e) {
        throw new Error(`Error occurred getting leaderboard: ${e}`)
    }
}
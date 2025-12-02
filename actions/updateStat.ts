export async function updateStat(testId: string) {
    try {
        const test = await prisma.test.findUnique({
            where: {
                id: testId,
                AND: [
                    { testStatus: "COMPLETED" }
                ]
            },
            select: {
                userId: true,
                quiz: {
                    select: {
                        creator: {
                            select: {
                                name: true
                            }
                        },
                        name: true
                    },
                },
                questions: {
                    select: {
                        id: true,
                        explanation: true,
                        options: {
                            select: {
                                id: true,
                                userSelected: true,
                                correct: true,
                                option: true,
                            }
                        },
                        question: true,
                        skip: true
                    }
                }
            }
        })
        if (!test) {
            console.log(`Error getting result data: ${test}`)
            throw new Error(`Error getting result data: ${test}`)
        }
        const correct = test?.questions.filter((q) => q.options.some((o) => o.userSelected && o.correct));
        const incorrect = test?.questions.filter((q) => q.options.some((o) => o.userSelected && !o.correct))
        const skipped = test?.questions.filter((q) => q.skip == true)
        const notAnswered = test?.questions.filter(
            (q) =>
                q.skip === false &&
                !q.options.some(o => o.userSelected === true)
        )

        await prisma.userStat.upsert({
            where: { userId: test.userId },
            update: {
                correct: { increment: correct.length },
                incorrect: { increment: incorrect.length },
                skipped: { increment: skipped.length },
                score: {
                    increment: correct.length * 4 - incorrect.length * 1 - skipped.length * 0.5 - notAnswered.length * 0.5
                },
            },
            create: {
                userId: test.userId,
                correct: correct.length,
                incorrect: incorrect.length,
                skipped: skipped.length,
                score: correct.length * 4 - incorrect.length * 1 - skipped.length * 0.5 - notAnswered.length * 0.5,
                currentRank: null,
                prevRank: null
            }
        });

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

        for (let i = 0; i < allStats.length; i++) {
            const stat = allStats[i];
            const newRank = i + 1;

            await prisma.userStat.update({
                where: { id: stat.id },
                data: {
                    prevRank: stat.currentRank,
                    currentRank: newRank,
                },
            });
        }

        return "stat updated"
    } catch (e) {
        console.error("Error occurred creating result:", e);
        throw new Error(`Error occurred creating result: ${e}`);
    }
}
import { Question, SelectedAnswers, TimePerQuestion, Test } from "@/lib/types"
import { useMemo } from "react"
import { toast } from "sonner"
import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function ResultsView({
    test,
    answers,
    timeData,
}: {
    test: Test
    answers: SelectedAnswers
    timeData: TimePerQuestion
}) {
    const router = useRouter();
    const { score, incorrectAnswers, totalQuestions } = useMemo(() => {
        let correct = 0
        const incorrectList: Question[] = []

        test.questions.forEach((q) => {
            const correctOption = q.options.find(opt => opt.correct === true)
            if (!correctOption) {
                incorrectList.push(q)
                return
            }
            const correctOptionId = correctOption.id
            if (answers[q.id] === correctOptionId) {
                correct++
            } else {
                incorrectList.push(q)
            }
        })

        return {
            score: correct,
            incorrectAnswers: incorrectList,
            totalQuestions: test.questions.length,
        }
    }, [test, answers])

    const handleShareResults = () => {
        const shareData = {
            test,
            answers,
            timeData,
            userName: "Anonymous",
            completedAt: new Date().toISOString()
        }

        const jsonString = JSON.stringify(shareData)
        const encoded = btoa(encodeURIComponent(jsonString))
        const shareUrl = `${window.location.origin}/results?data=${encoded}`

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                toast.success("Results link copied to clipboard!")
            }).catch(() => {
                toast("Copy this link:", { description: shareUrl, duration: 15000 })
            })
        } else {
            toast("Copy this link:", { description: shareUrl, duration: 15000 })
        }
    }

    return (
        <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
            <section className="w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold">Test Completed!</h1>
                    <p className="text-2xl mt-2 text-primary font-semibold">
                        Your Score: {score} / {totalQuestions}
                    </p>
                </div>

                {incorrectAnswers.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Review Your Mistakes</h2>
                        <div className="space-y-4">
                            {incorrectAnswers.map((q) => {
                                const userAnswer = answers[q.id]
                                const correctOption = q.options.find(opt => opt.correct)

                                return (
                                    <div key={q.id} className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <p className="font-semibold">{q.question}</p>
                                        <div className="mt-2 text-sm space-y-1">
                                            <p>
                                                <span className="font-medium">Your answer:</span>{" "}
                                                {userAnswer
                                                    ? q.options.find(o => o.id === userAnswer)?.option || "Unknown"
                                                    : "Skipped"}
                                            </p>
                                            {q.explanation && (
                                                <p className="mt-2 text-muted-foreground">
                                                    <span className="font-medium">Explanation:</span> {q.explanation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-4 border-t pt-6">
                    <Button onClick={() => router.push('/')} className="w-full sm:w-auto px-6 py-3 gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Button>
                    <Button variant={"outline"} onClick={handleShareResults} className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Results
                    </Button>
                </div>
            </section>
        </main>
    )
}
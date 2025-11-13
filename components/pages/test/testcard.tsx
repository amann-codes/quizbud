"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SelectedAnswers, TimePerQuestion, Test } from "@/lib/types"
import { ResultsView } from "@/components/pages/result/resultcard"
import { useQuery } from "@tanstack/react-query"
import { getTest } from "@/actions/getTest"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { pad, toHMS } from "@/lib/utils"

export function TestCard({ id }: { id: string }) {

    const router = useRouter();

    const getTestQuery = useQuery({
        queryKey: ["testData", id],
        queryFn: (): Promise<Test> => getTest(id),
    })

    const [testState, setTestState] = useState<"taking" | "completed">("taking")
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})
    const [totalElapsed, setTotalElapsed] = useState(0)
    const [questionElapsed, setQuestionElapsed] = useState(0)
    const [timePerQuestion, setTimePerQuestion] = useState<TimePerQuestion>({})

    const baseTotalElapsedRef = useRef(0)
    const baseQuestionElapsedRef = useRef(0)
    const startTotalAtRef = useRef<number | null>(null)
    const startQuestionAtRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const isRunningRef = useRef(false)

    const tick = () => {
        if (!isRunningRef.current) return
        const now = performance.now()

        if (startTotalAtRef.current != null) {
            const currentTotal = baseTotalElapsedRef.current + (now - startTotalAtRef.current)
            setTotalElapsed(currentTotal)
            if (timeLimitMs && currentTotal >= timeLimitMs) {
                handleSubmit()
                return
            }
        }

        if (startQuestionAtRef.current != null) {
            const currentQuestionTime = baseQuestionElapsedRef.current + (now - startQuestionAtRef.current)
            setQuestionElapsed(currentQuestionTime)
        }

        rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
        if (isRunningRef.current) return
        isRunningRef.current = true
        const now = performance.now()
        startTotalAtRef.current = now
        startQuestionAtRef.current = now
        rafRef.current = requestAnimationFrame(tick)
    }

    const stop = () => {
        if (!isRunningRef.current) return
        isRunningRef.current = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        if (startTotalAtRef.current) {
            baseTotalElapsedRef.current += performance.now() - startTotalAtRef.current
        }
        if (startQuestionAtRef.current) {
            baseQuestionElapsedRef.current += performance.now() - startQuestionAtRef.current
        }
        startTotalAtRef.current = null
        startQuestionAtRef.current = null
    }

    const resetQuestionTimer = () => {
        baseQuestionElapsedRef.current = 0
        startQuestionAtRef.current = performance.now()
        setQuestionElapsed(0)
    }

    const goToNext = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setTimePerQuestion((prev) => ({
                ...prev,
                [currentQuestion.id]: Math.floor(questionElapsed / 1000),
            }))
            setCurrentQuestionIndex((prev) => prev + 1)
            resetQuestionTimer()
        }
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setTimePerQuestion((prev) => ({
                ...prev,
                [currentQuestion.id]: Math.floor(questionElapsed / 1000),
            }))
            setCurrentQuestionIndex((prev) => prev - 1)
            resetQuestionTimer()
        }
    }

    const handleReset = () => {
        setSelectedAnswers((prev) => {
            const next = { ...prev }
            delete next[currentQuestion.id]
            return next
        })
    }

    const handleSelectOption = (optionId: string) => {
        setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
    }

    const handleSubmit = () => {
        stop()
        setTimePerQuestion((prev) => ({
            ...prev,
            [currentQuestion.id]: Math.floor(questionElapsed / 1000),
        }))
        setTestState("completed")
    }

    if (getTestQuery.isError) {
        return (
            <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        Test Not Found
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        The test you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <div className="flex justify-center">
                        <Button onClick={() => router.push('/')} className="w-full sm:w-auto px-6 py-3 gap-2">
                            <ArrowLeft className="h-5 w-5" />
                            Back to Home
                        </Button>
                    </div>
                </section>
            </main>
        )
    }

    if (getTestQuery.isPending) {
        return (
            <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                        <div className="flex items-center justify-between border-t pt-6">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const test = getTestQuery.data
    const timeLimitMs = "timeLimit" in test ? test.timeLimit * 1000 : 0
    const timeLeftMs = timeLimitMs ? Math.max(0, timeLimitMs - totalElapsed) : 0
    const currentQuestion = test.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100

    if (testState === "taking" && !isRunningRef.current && timeLimitMs) start()

    if (testState === "completed") {
        return <ResultsView test={test} answers={selectedAnswers} timeData={timePerQuestion} />
    }

    const { m, s } = toHMS(timeLeftMs)

    return (
        <div className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{test.name}</CardTitle>
                        {timeLimitMs > 0 && (
                            <div className="font-semibold px-4 py-2 rounded-lg bg-destructive/10 text-destructive" aria-live="polite">
                                Time Left: {pad(m)}:{pad(s)}
                            </div>
                        )}
                    </div>
                    <Progress value={progress} className="h-2" />
                    <CardDescription>
                        Question {currentQuestionIndex + 1} of {test.questions.length}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="rounded-lg border p-6">
                        <h2 className="text-2xl font-semibold">{currentQuestion.question}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option) => {
                            const isSelected = selectedAnswers[currentQuestion.id] === option.id
                            return (
                                <Button
                                    key={option.id}
                                    onClick={() => handleSelectOption(option.id)}
                                    variant={isSelected ? "default" : "outline"}
                                    className="h-auto py-4 text-left justify-start font-normal"
                                    aria-pressed={isSelected}
                                >
                                    {option.option}
                                </Button>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button variant="outline" onClick={goToNext}>
                                Skip
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                            >
                                Prev
                            </Button>
                            {currentQuestionIndex === test.questions.length - 1 ? (
                                <Button
                                    variant="default"
                                    onClick={handleSubmit}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button variant="default" onClick={goToNext}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
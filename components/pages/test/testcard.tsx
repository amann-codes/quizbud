"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Test, EventPayload } from "@/lib/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getTest } from "@/actions/getTest"
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { getUUID, pad, toHMS } from "@/lib/utils"
import { updateTest } from "@/actions/updateTest"

export function TestCard({ id }: { id: string }) {
    const router = useRouter();
    const [testState, setTestState] = useState<"COMPLETED" | "IN_PROGRESS">()
    const [selectedOption, setSelectedOption] = useState<string>()
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const startedAtRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const hasTimedOutRef = useRef(false);

    const triggerTimeout = () => {
        if (hasTimedOutRef.current) return;
        hasTimedOutRef.current = true;

        const payload: EventPayload = {
            eventType: "TIMEOUT",
            idempotencyKey: getUUID(),
            clientTimestamp: new Date(),
            questionIndex: currentQuestionIndex,
        };

        updateTestMutation.mutate({ payload, testId: id });
        setTestState("COMPLETED");
    };



    const getTestQuery = useQuery({
        queryKey: ["testData", id],
        queryFn: (): Promise<Test> => getTest(id),
    })

    const updateTestMutation = useMutation({
        mutationFn: updateTest,

    })

    const test = getTestQuery.data;

    const tick = useCallback(() => {
        if (startedAtRef.current == null || !test) return;
        const elapsed = Date.now() - startedAtRef.current;
        const remaining = Math.max(0, test.timeLimit * 1000 - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0) {
            triggerTimeout();
            return;
        }
        setTimeLeft(remaining);
        rafRef.current = requestAnimationFrame(tick);
    }, [test]);

    useEffect(() => {
        if (!getTestQuery.data?.startedAt) { console.log("getTestQuery.data?.startedAt", getTestQuery.data?.startedAt); return; }

        setTestState(getTestQuery.data.testStatus)
        setCurrentQuestionIndex(getTestQuery.data?.currentIndex)
        setSelectedOption(getTestQuery.data.questions[currentQuestionIndex].options.find(o => o.userSelected == true)?.id)

        startedAtRef.current = new Date(getTestQuery.data.startedAt).getTime();

        const elapsed = Date.now() - startedAtRef.current;
        const remaining = Math.max(0, getTestQuery.data.timeLimit * 1000 - elapsed);
        setTimeLeft(remaining);

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [getTestQuery.data?.startedAt]);

    useEffect(() => {
        if (testState == "COMPLETED") {
            const url = typeof window !== "undefined" ? `${window.location.origin}/result/${id}` : ""
            router.push(url)
        }
    }, [testState])

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

    if (getTestQuery.isError || !test) {
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
                        The test you&apos;re looking for doesn&apos;t exist or has been removed.Or you may not have access to this test
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

    const goToNext = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);

            const payload: EventPayload = {
                eventType: "NAVIGATE",
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: nextIndex
            };

            updateTestMutation.mutate({ payload, testId: id });
        }
    }

    const handleSkip = (questionId: string) => {
        if (currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);

            const payload: EventPayload = {
                eventType: "SKIP",
                questionId: questionId,
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: nextIndex
            };

            updateTestMutation.mutate({ payload, testId: id });
        }
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);

            const payload: EventPayload = {
                eventType: "NAVIGATE",
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: prevIndex
            };

            updateTestMutation.mutate({ payload, testId: id });
        }
    }

    const handleReset = () => {
        const payload: EventPayload = {
            eventType: "RESET",
            questionIndex: currentQuestionIndex,
            clientTimestamp: new Date(),
            questionId: currentQuestion.id,
            idempotencyKey: getUUID()
        }
        updateTestMutation.mutate({ payload, testId: id })
    }

    const handleSelectOption = (optionId: string) => {
        setSelectedOption(optionId)
        const payload: EventPayload = {
            eventType: "SELECT",
            clientTimestamp: new Date(),
            questionId: currentQuestion.id,
            optionId: optionId,
            questionIndex: currentQuestionIndex,
            idempotencyKey: getUUID()
        }
        updateTestMutation.mutate({ payload, testId: id })
    }

    const handleSubmit = () => {
        const payload: EventPayload = {
            eventType: "SUBMIT",
            questionIndex: currentQuestionIndex,
            clientTimestamp: new Date(),
            idempotencyKey: getUUID(),
        }
        updateTestMutation.mutate({ payload, testId: id })
        setTestState("COMPLETED")
    }

    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100
    const { m, s } = toHMS(timeLeft)
    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className={`min-h-dvh bg-background text-foreground flex items-center justify-center p-4 sm:p-6 ${updateTestMutation.isPending ? 'opacity-50 pointer-events-none' : ''
            }`} aria-disabled={updateTestMutation.isPending}>
            <Card className="w-full max-w-3xl">
                <CardHeader className="space-y-4 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardDescription className="text-base text-center sm:text-left">
                            <CardTitle className="text-xl">{test.quiz.name}</CardTitle>
                            Question {currentQuestionIndex + 1} of {test.questions.length}
                        </CardDescription>
                        <div className="font-semibold px-4 py-2 rounded-lg bg-destructive/10 text-destructive self-center sm:self-auto" aria-live="polite">
                            Time Left: {pad(m)}:{pad(s)}
                        </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6 pt-4 sm:pt-6">
                    <div className="rounded-lg border p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold">{currentQuestion.question}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {currentQuestion.options.map((option) => {
                            const isSelected = option.userSelected || option.id === selectedOption;
                            return (
                                <Card
                                    key={option.id}
                                    onClick={() => handleSelectOption(option.id)}
                                    className={`h-auto py-3 sm:py-4 text-left justify-start font-normal text-sm sm:text-base ${isSelected ? "bg-primary text-secondary" : "bg-secondary text-primary"}`} aria-pressed={isSelected}
                                >
                                    <CardContent>
                                        {option.option}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="hidden sm:flex flex-col gap-4 border-t pt-6">
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button variant="outline" disabled={currentQuestionIndex === test.questions.length - 1} onClick={() => handleSkip(currentQuestion.id)}>
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
                    </div>

                    <div className="flex sm:hidden flex-col gap-4">

                        <div className="flex justify-center gap-2 border-b pb-6">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className="w-1/2 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Prev
                            </Button>
                            {currentQuestionIndex === test.questions.length - 1 ? (
                                <Button
                                    variant="default"
                                    onClick={handleSubmit}
                                    className="w-1/2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    onClick={goToNext}
                                    className="w-1/2 flex items-center justify-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button variant="outline" onClick={handleReset} className="w-1/2">
                                Reset
                            </Button>
                            <Button variant="outline" onClick={goToNext} className="w-1/2">
                                Skip
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
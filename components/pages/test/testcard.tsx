"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Test, EventPayload } from "@/lib/types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getTest } from "@/actions/getTest"
import { AlertTriangle, ArrowLeft, ArrowRight, Clock, RotateCcw, SkipForward, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUUID, pad, toHMS, cn } from "@/lib/utils"
import { updateTest } from "@/actions/updateTest"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function TestCard({ id }: { id: string }) {
    const router = useRouter();
    const [testState, setTestState] = useState<"COMPLETED" | "IN_PROGRESS">()
    const [selectedOption, setSelectedOption] = useState<string | null>()
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const startedAtRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const hasTimedOutRef = useRef(false);
    const eventQueRef = useRef<EventPayload[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const getTestQuery = useQuery({
        queryKey: ["testData", id],
        queryFn: (): Promise<Test> => getTest(id),
    })

    const updateTestMutation = useMutation({
        mutationFn: updateTest,
    })

    const test = getTestQuery.data;

    const flush = useCallback(() => {
        const queue = eventQueRef.current
        if (queue.length === 0) return
        eventQueRef.current = []
        updateTestMutation.mutate({ events: queue, testId: id })
    }, [id, updateTestMutation])

    const triggerTimeout = () => {
        if (hasTimedOutRef.current) return
        hasTimedOutRef.current = true

        const events: EventPayload[] = [{
            eventType: "TIMEOUT",
            idempotencyKey: getUUID(),
            clientTimestamp: new Date(),
            questionIndex: currentQuestionIndex
        }]

        flush()
        updateTestMutation.mutate({ events, testId: id })
        setTestState("COMPLETED")
    }

    const tick = useCallback(() => {
        if (!startedAtRef.current || !test) return

        const elapsed = Date.now() - startedAtRef.current
        const remaining = Math.max(0, test.quiz.timeLimit * 1000 - elapsed)

        setTimeLeft(remaining)

        if (remaining === 0) {
            triggerTimeout()
            return
        }

        rafRef.current = requestAnimationFrame(tick)
    }, [test])

    useEffect(() => {
        if (!test?.startedAt) return

        startedAtRef.current = new Date(test.startedAt).getTime()

        const elapsed = Date.now() - startedAtRef.current
        const remaining = Math.max(0, test.quiz.timeLimit * 1000 - elapsed)
        setTimeLeft(remaining)

        rafRef.current = requestAnimationFrame(tick)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [test?.startedAt, tick])

    useEffect(() => {
        if (!test) return

        setTestState(test.testStatus)
        setCurrentQuestionIndex(test.currentIndex)
        setSelectedOption(
            test.questions[test.currentIndex]
                ?.options.find(o => o.userSelected)?.id
        )
    }, [test])

    useEffect(() => {
        if (testState === "COMPLETED") {
            router.push(`/result/${id}`)
        }
    }, [testState])

    useEffect(() => {
        const interval = setInterval(flush, 5000)
        return () => clearInterval(interval)
    }, [flush])


    if (getTestQuery.isPending) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center p-4 sm:p-6 relative overflow-hidden font-sans">

                <div className="w-full max-w-5xl z-10 mb-8 pt-4 sm:pt-8 sticky top-0">
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48 sm:w-64 bg-zinc-800 rounded-md" />
                            <Skeleton className="h-4 w-32 bg-zinc-800/50 rounded-md" />
                        </div>

                        <Skeleton className="h-9 w-24 rounded-full bg-zinc-800" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full bg-zinc-800/50" />
                </div>

                <div className="w-full max-w-4xl z-10 flex-1 flex flex-col justify-center space-y-8">

                    <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 h-32 sm:h-40 flex flex-col justify-center gap-3">
                        <Skeleton className="h-6 w-full bg-zinc-800 rounded-md" />
                        <Skeleton className="h-6 w-3/4 bg-zinc-800 rounded-md" />
                        <Skeleton className="h-6 w-1/2 bg-zinc-800 rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-[72px] p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/20 flex items-center gap-4">
                                <Skeleton className="h-6 w-6 rounded-full bg-zinc-800 shrink-0" />
                                <Skeleton className="h-5 w-1/2 bg-zinc-800/50 rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-20 bg-neutral-950/80 backdrop-blur-lg border-t border-zinc-800 p-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:flex gap-3">
                            <Skeleton className="h-9 w-20 bg-zinc-800 rounded-md" />
                            <Skeleton className="h-9 w-20 bg-zinc-800 rounded-md" />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <Skeleton className="h-10 w-24 bg-zinc-800 rounded-md" />
                            <Skeleton className="h-10 w-24 bg-zinc-800 rounded-md" />
                        </div>
                    </div>
                </div>
                <div className="h-32 sm:h-24 w-full" />
            </div>
        )
    }

    if (getTestQuery.isError || !test) {
        return (
            <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>
                <div className="relative z-10 w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Test Not Found</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                        The test you&apos;re looking for doesn&apos;t exist, has been removed, or you don't have access.
                    </p>
                    <Button onClick={() => router.push('/')} variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-red-900/10 hover:text-red-300 w-full">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                </div>
            </main >
        )
    }

    const goToNext = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            const nextQ = test.questions[nextIndex];
            const previouslySelected = nextQ.options.find(o => o.userSelected)?.id;
            setSelectedOption(previouslySelected || null);

            const payload: EventPayload = {
                eventType: "NAVIGATE",
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: nextIndex
            };
            eventQueRef.current.push(payload);
        }
    }

    const handleSkip = (questionId: string) => {
        if (currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setSelectedOption(null);

            const payload: EventPayload = {
                eventType: "SKIP",
                questionId: questionId,
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: nextIndex
            };
            eventQueRef.current.push(payload);
        }
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);
            const prevQ = test.questions[prevIndex];
            const previouslySelected = prevQ.options.find(o => o.userSelected)?.id;
            setSelectedOption(previouslySelected || null);

            const payload: EventPayload = {
                eventType: "NAVIGATE",
                clientTimestamp: new Date(),
                idempotencyKey: getUUID(),
                questionIndex: prevIndex
            };
            eventQueRef.current.push(payload);
        }
    }

    const handleReset = () => {
        setSelectedOption(null)
        const payload: EventPayload = {
            eventType: "RESET",
            questionIndex: currentQuestionIndex,
            clientTimestamp: new Date(),
            questionId: currentQuestion.id,
            idempotencyKey: getUUID()
        }
        eventQueRef.current.push(payload);
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
        eventQueRef.current.push(payload);
    }

    const handleSubmit = () => {
        setSubmitting(true)
        const payload: EventPayload[] = [{
            eventType: "SUBMIT",
            questionIndex: currentQuestionIndex,
            clientTimestamp: new Date(),
            idempotencyKey: getUUID(),
        }];
        flush();
        updateTestMutation.mutate({ events: payload, testId: id })
        setTestState("COMPLETED")
    }

    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100
    const { m, s } = toHMS(timeLeft)
    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className={cn(
            "min-h-screen bg-neutral-950 text-white flex flex-col items-center p-4 sm:p-6 relative overflow-hidden font-sans",
            submitting && 'opacity-80 pointer-events-none grayscale'
        )}>
            <div className="absolute inset-0 z-0 pointer-events-none"><BackgroundBeams /></div>

            <div className="w-full max-w-5xl z-10 mb-8 pt-4 sm:pt-8 sticky top-0 bg-neutral-950/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-auto sm:static sm:bg-transparent sm:backdrop-blur-none">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-md">
                            {test.quiz.name}
                        </h1>
                        <span className="text-xs text-zinc-400">
                            Question <span className="text-white font-medium">{currentQuestionIndex + 1}</span> of {test.questions.length}
                        </span>
                    </div>

                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shadow-inner transition-colors",
                        timeLeft < 60000 ? "border-red-500/30 bg-red-500/10" : ""
                    )}>
                        <Clock className={cn("w-4 h-4", timeLeft < 60000 ? "text-red-400 animate-pulse" : "text-indigo-400")} />
                        <span className={cn("font-mono font-bold tabular-nums text-sm", timeLeft < 60000 ? "text-red-400" : "text-white")}>
                            {pad(m)}:{pad(s)}
                        </span>
                    </div>
                </div>

                <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <div className="w-full max-w-4xl z-10 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed text-zinc-100">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {currentQuestion.options.map((option) => {
                                const isSelected = option.id === selectedOption;
                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleSelectOption(option.id)}
                                        className={cn(
                                            "group relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-4",
                                            isSelected
                                                ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                                : "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/50 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center w-6 h-6 rounded-full border transition-all",
                                            isSelected
                                                ? "border-indigo-400 bg-indigo-500 text-white"
                                                : "border-zinc-600 bg-transparent group-hover:border-zinc-400"
                                        )}>
                                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <span className={cn(
                                            "text-base sm:text-lg font-medium",
                                            isSelected ? "text-indigo-100" : "text-zinc-300 group-hover:text-zinc-100"
                                        )}>
                                            {option.option}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-20 bg-neutral-950/80 backdrop-blur-lg border-t border-white/5 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:flex gap-3">
                        <Button variant="ghost" onClick={handleReset} className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button
                            variant="ghost"
                            disabled={currentQuestionIndex === test.questions.length - 1}
                            onClick={() => handleSkip(currentQuestion.id)}
                            className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800"
                        >
                            <SkipForward className="w-4 h-4 mr-2" /> Skip
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 w-full justify-center sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className="border-zinc-700 bg-transparent cursor-pointer text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                        </Button>

                        {currentQuestionIndex === test.questions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                className="bg-emerald-600 cursor-pointer hover:bg-emerald-500 text-white font-semibold px-8 shadow-lg shadow-emerald-900/20"
                            >
                                Submit Test
                            </Button>
                        ) : (
                            <Button
                                onClick={goToNext}
                                className="bg-white cursor-pointer text-black hover:bg-zinc-200 font-semibold px-8"
                            >
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="sm:hidden flex justify-center gap-8 mt-4 text-xs text-zinc-500 font-medium">
                    <Button onClick={handleReset} className="flex items-center gap-1 cursor-pointer active:text-white"><RotateCcw className="w-3 h-3" /> Reset Answer</Button>
                    <Button onClick={() => handleSkip(currentQuestion.id)} className="flex items-center gap-1 cursor-pointer active:text-white"><SkipForward className="w-3 h-3" /> Skip Question</Button>
                </div>
            </div>

        </div>
    )
}
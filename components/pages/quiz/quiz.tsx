"use client"

import { FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Topic, Difficulty, TimeLimit, QuesitonsLimit } from "@/lib/types"
import { TOPICS, DIFFICULTIES, TIME_LIMITS, QUESTION_COUNTS } from "@/lib/tags"
import { useMutation } from "@tanstack/react-query"
import { createQuiz } from "@/actions/createQuiz"
import { ChevronRight, ChevronLeft, Loader2, Wand2 } from "lucide-react"
import { toast } from "sonner"

type Step = 1 | 2 | 3

const MIN_CUSTOM_QUESTIONS = 5
const MAX_CUSTOM_QUESTIONS = 50

export default function QuizForm() {
    const [step, setStep] = useState<Step>(1)
    const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set())
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>()
    const [timeLimit, setTimeLimit] = useState<TimeLimit | undefined>()
    const [questionCount, setQuestionCount] = useState<QuesitonsLimit | undefined>()
    const [customCount, setCustomCount] = useState<string>("")

    const getCompletionProgress = (): number => {
        let score = 0
        if (selectedTopics.size > 0) score += 25
        if (difficulty) score += 25
        if (timeLimit) score += 25
        if (questionCount) {
            score += 25
        } else if (customCount) {
            const n = parseInt(customCount)
            if (!isNaN(n) && n >= MIN_CUSTOM_QUESTIONS && n <= MAX_CUSTOM_QUESTIONS) {
                score += 25
            }
        }
        return score
    }

    const progress = getCompletionProgress()

    const toggleTopic = (value: Topic) => {
        setSelectedTopics(prev => {
            const next = new Set(prev)
            next.has(value) ? next.delete(value) : next.add(value)
            return next
        })
    }

    const selectSingle = <T extends string>(setter: (v: T | undefined) => void, current: T | undefined, value: T) => {
        setter(current === value ? undefined : value)
    }

    const createQuizQuery = useMutation({
        mutationFn: createQuiz,
        onSuccess: (id) => {
            window.location.href = `/quiz/${id}`
        },
        onError: (error) => {
            toast(error.message)
        }
    })

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3) as Step)
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

    const canProceed = () => {
        switch (step) {
            case 1:
                return selectedTopics.size > 0
            case 2:
                return !!difficulty && !!timeLimit
            case 3:
                const custom = parseInt(customCount)
                const validCustom = !isNaN(custom) && custom >= MIN_CUSTOM_QUESTIONS && custom <= MAX_CUSTOM_QUESTIONS
                return !!questionCount || validCustom
            default:
                return false
        }
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!canProceed() || !difficulty || !timeLimit) return

        const topicsArray = Array.from(selectedTopics)
        const finalQuestionCount = customCount ? parseInt(customCount) : questionCount!

        createQuizQuery.mutate({
            topics: topicsArray,
            difficulty,
            timeLimit,
            questionCount: finalQuestionCount
        })
    }

    return (
        <div className={`h-full w-full flex items-center justify-center p-4 bg-background ${createQuizQuery.isPending ? "pointer-events-none opacity-50 select-none" : ""}`}
            aria-disabled={createQuizQuery.isPending} >
            <Card className="w-full max-w-3xl border bg-card text-card-foreground">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Create Quiz</CardTitle>
                        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
                    </div>
                    <Progress value={progress} className="h-2 mt-3" />
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xl font-semibold">Select Topics</Label>
                                    <p className="text-sm text-muted-foreground">Choose one or more topics.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TOPICS.map(t => {
                                        const selected = selectedTopics.has(t.value)
                                        return (
                                            <div
                                                key={t.value}
                                                onClick={() => toggleTopic(t.value)}
                                                className={cn("rounded-full border px-3 py-2 cursor-pointer", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                            >
                                                {t.label}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xl font-semibold">Difficulty & Time</Label>
                                        <p className="text-sm text-muted-foreground">Set challenge level and duration.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Difficulty</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {DIFFICULTIES.map(d => {
                                                const selected = difficulty === d.value
                                                return (
                                                    <div
                                                        key={d.value}
                                                        onClick={() => selectSingle(setDifficulty, difficulty, d.value)}
                                                        className={cn("rounded-full border px-3 py-2 cursor-pointer", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                                    >
                                                        {d.label}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Time Limit</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {TIME_LIMITS.map(t => {
                                                const selected = timeLimit === t.value
                                                return (
                                                    <div
                                                        key={t.value}
                                                        onClick={() => selectSingle(setTimeLimit, timeLimit, t.value)}
                                                        className={cn("rounded-full border px-3 py-2 cursor-pointer", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                                    >
                                                        {t.label}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xl font-semibold">Number of Questions</Label>
                                    <p className="text-sm text-muted-foreground">Choose a preset count or enter a custom amount (between {MIN_CUSTOM_QUESTIONS} and {MAX_CUSTOM_QUESTIONS}).</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {QUESTION_COUNTS.map(t => {
                                        const selected = questionCount === t.value
                                        return (
                                            <div
                                                key={t.value}
                                                onClick={() => { setQuestionCount(t.value); setCustomCount(""); }}
                                                className={cn("rounded-full border px-3 py-2 cursor-pointer", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                            >
                                                {t.label}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-medium">Or enter a custom amount</Label>
                                    <Input
                                        type="number"
                                        placeholder={`e.g., ${MIN_CUSTOM_QUESTIONS}`}
                                        min={MIN_CUSTOM_QUESTIONS}
                                        max={MAX_CUSTOM_QUESTIONS}
                                        value={customCount}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            const num = Number(value)
                                            if (value === "") {
                                                setCustomCount("")
                                                setQuestionCount(undefined)
                                                return
                                            }
                                            if (isNaN(num)) return
                                            if (num < MIN_CUSTOM_QUESTIONS) {
                                                setCustomCount(String(MIN_CUSTOM_QUESTIONS))
                                            } else if (num > MAX_CUSTOM_QUESTIONS) {
                                                setCustomCount(String(MAX_CUSTOM_QUESTIONS))
                                            } else {
                                                setCustomCount(String(num))
                                            }
                                            setQuestionCount(undefined)
                                        }}
                                        className="w-48"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={cn("cursor-pointer", step === 1 && "invisible")}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="cursor-pointer"
                                    disabled={!canProceed()}
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="text-xl px-6 py-2 cursor-pointer"
                                    disabled={createQuizQuery.isPending || !canProceed()}
                                >
                                    {createQuizQuery.isPending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Wand2 className="h-5 w-5" />
                                    )}
                                    {createQuizQuery.isPending ? "Generating..." : "Generate"}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
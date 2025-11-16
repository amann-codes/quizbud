"use client"

import { FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Topic, Difficulty, TimeLimit } from "@/lib/types"
import { TOPICS, DIFFICULTIES, TIME_LIMITS, QUESTION_COUNTS } from "@/lib/tags"
import { useMutation } from "@tanstack/react-query"
import { createQuiz } from "@/actions/createQuiz"
import { ChevronRight, ChevronLeft } from "lucide-react"

type Step = 1 | 2 | 3

export default function QuizForm() {
    const [step, setStep] = useState<Step>(1)
    const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set())
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
    const [timeLimit, setTimeLimit] = useState<TimeLimit | null>(null)
    const [questionCount, setQuestionCount] = useState<string | null>(null)
    const [customCount, setCustomCount] = useState<string>("")

    const totalSteps = 3
    const progress = (step / totalSteps) * 100

    const toggleTopic = (value: Topic) => {
        setSelectedTopics(prev => {
            const next = new Set(prev)
            next.has(value) ? next.delete(value) : next.add(value)
            return next
        })
    }

    const selectSingle = <T extends string>(setter: (v: T | null) => void, current: T | null, value: T) => {
        setter(current === value ? null : value)
    }

    const isCustomSelected = questionCount === "custom"
    const resolvedCount = isCustomSelected ? customCount : (questionCount ?? "")

    const createQuizQuery = useMutation({
        mutationFn: createQuiz,
        onSuccess: (id) => {
            window.location.href = `/quiz/${id}`
        },
        onError: (err) => {
            console.error("Failed to generate quiz:", err)
        },
    })

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps) as Step)
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

    const canProceed = () => {
        switch (step) {
            case 1: return selectedTopics.size > 0
            case 2: return !!difficulty || !!timeLimit
            case 3: return !!questionCount && (!isCustomSelected || customCount.trim().length > 0)
            default: return false
        }
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createQuizQuery.mutate()
    }

    return (
        <div className="h-full w-full flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-3xl border bg-card text-card-foreground">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Create Quiz</CardTitle>
                        <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
                    </div>
                    <Progress value={progress} className="h-2 mt-3" />
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xl font-semibold">Select Topics</Label>
                                    <p className="text-sm text-muted-foreground">Choose one or more topics to focus your quiz.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TOPICS.map(t => {
                                        const selected = selectedTopics.has(t.value)
                                        return (
                                            <Button
                                                key={t.value}
                                                type="button"
                                                variant="outline"
                                                onClick={() => toggleTopic(t.value)}
                                                className={cn("h-10 rounded-full border", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                            >
                                                {t.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xl font-semibold">Difficulty & Time</Label>
                                        <p className="text-sm text-muted-foreground">Set challenge level and time constraint.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Difficulty</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {DIFFICULTIES.map(d => {
                                                const selected = difficulty === d.value
                                                return (
                                                    <Button
                                                        key={d.value}
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => selectSingle(setDifficulty, difficulty, d.value)}
                                                        className={cn("h-10 rounded-full border", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                                    >
                                                        {d.label}
                                                    </Button>
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
                                                    <Button
                                                        key={t.value}
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => selectSingle(setTimeLimit, timeLimit, t.value)}
                                                        className={cn("h-10 rounded-full border", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                                    >
                                                        {t.label}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xl font-semibold">Number of Questions</Label>
                                    <p className="text-sm text-muted-foreground">Choose how many questions to include.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {QUESTION_COUNTS.map(t => {
                                        const selected = questionCount === t.value
                                        return (
                                            <Button
                                                key={t.value}
                                                type="button"
                                                variant="outline"
                                                onClick={() => { setQuestionCount(t.value); setCustomCount(""); }}
                                                className={cn("h-10 rounded-full border", selected ? "bg-primary text-primary-foreground border-transparent" : "bg-secondary text-secondary-foreground")}
                                            >
                                                {t.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                                {isCustomSelected && (
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="customCount">Custom count</Label>
                                        <input
                                            id="customCount"
                                            type="number"
                                            min="1"
                                            value={customCount}
                                            onChange={e => setCustomCount(e.target.value)}
                                            className="rounded-md border border-input bg-background px-3 py-2 text-sm w-32"
                                            placeholder="e.g. 25"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {[...selectedTopics].map(topic => (
                            <input key={topic} type="hidden" name="topics[]" value={topic} />
                        ))}
                        <input type="hidden" name="difficulty" value={difficulty ?? ""} />
                        <input type="hidden" name="timeLimit" value={timeLimit ?? ""} />
                        <input type="hidden" name="questionCount" value={resolvedCount} />

                        <div className="flex items-center justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={cn(step === 1 && "invisible")}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>

                            {step < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="text-xl px-6"
                                    disabled={createQuizQuery.isPending || !canProceed()}
                                >
                                    {createQuizQuery.isPending ? "Generating..." : "Generate Quiz"}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
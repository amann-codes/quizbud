"use client"

import { FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Topic, Difficulty, TimeLimit } from "@/lib/types"
import { TOPICS, DIFFICULTIES, TIME_LIMITS, QUESTION_COUNTS } from "@/lib/tags"
import { useMutation } from "@tanstack/react-query"
import { createQuiz } from "@/actions/createQuiz"

export default function QuizForm() {
    const [description, setDescription] = useState("")
    const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set())
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
    const [timeLimit, setTimeLimit] = useState<TimeLimit | null>(null)
    const [questionCount, setQuestionCount] = useState<string | null>(null)
    const [customCount, setCustomCount] = useState<string>("")

    const toggleTopic = (value: Topic) => {
        setSelectedTopics((prev) => {
            const next = new Set(prev)
            if (next.has(value)) next.delete(value)
            else next.add(value)
            return next
        })
    }

    const selectSingle = <T extends string>(setter: (v: T | null) => void, current: T | null, value: T) => {
        setter(current === value ? null : value)
    }

    const isCustomSelected = questionCount === "custom"
    const resolvedCount = isCustomSelected ? customCount : (questionCount ?? "")

    const hasAnyTag = selectedTopics.size > 0 || !!difficulty || !!timeLimit || !!questionCount

    const createQuizQuery = useMutation({
        mutationFn: createQuiz,
        onSuccess: (id) => {
            window.location.href = `/quiz/${id}`
        },
        onError: (err) => {
            console.error("Failed to generate quiz:", err)
        },
    })

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createQuizQuery.mutate()
    }

    return (
        <div className="h-full w-full flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-3xl border bg-card text-card-foreground">
                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-3xl font-semibold" htmlFor="description">Describe your quiz</Label>
                            <div
                                role="group"
                                aria-label="Description with selected tags"
                                className="relative flex min-h-28 w-full flex-wrap items-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {!hasAnyTag && description.trim().length === 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3 top-2 select-none text-muted-foreground"
                                    >
                                        {"e.g., A timed quiz on basic aptitude and logical reasoning focusing on pattern recognition."}
                                    </span>
                                )}

                                {[...selectedTopics].map((topic) => {
                                    const label = TOPICS.find((t) => t.value === topic)?.label ?? topic
                                    return (
                                        <div
                                            key={`topic-chip-${topic}`}
                                            className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground"
                                        >
                                            <span>{label}</span>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${label}`}
                                                onClick={() =>
                                                    setSelectedTopics((prev) => {
                                                        const next = new Set(prev)
                                                        next.delete(topic)
                                                        return next
                                                    })
                                                }
                                                className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-secondary/70"
                                            >
                                                {"×"}
                                            </button>
                                        </div>
                                    )
                                })}

                                {difficulty && (
                                    <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
                                        <span>{DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? difficulty}</span>
                                        <button
                                            type="button"
                                            aria-label="Remove difficulty"
                                            onClick={() => setDifficulty(null)}
                                            className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-secondary/70"
                                        >
                                            {"×"}
                                        </button>
                                    </div>
                                )}

                                {timeLimit && (
                                    <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
                                        <span>{TIME_LIMITS.find((t) => t.value === timeLimit)?.label ?? timeLimit}</span>
                                        <button
                                            type="button"
                                            aria-label="Remove time limit"
                                            onClick={() => setTimeLimit(null)}
                                            className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-secondary/70"
                                        >
                                            {"×"}
                                        </button>
                                    </div>
                                )}

                                {questionCount && (
                                    <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
                                        <span>
                                            {questionCount === "custom" ? `Custom${customCount ? `: ${customCount}` : ""}` : questionCount}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label="Remove question count"
                                            onClick={() => {
                                                setQuestionCount(null)
                                                setCustomCount("")
                                            }}
                                            className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-secondary/70"
                                        >
                                            {"×"}
                                        </button>
                                    </div>
                                )}

                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder=""
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-20 w-full flex-1 resize-y border-0 bg-transparent p-0 outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>
                        </div>
                        <fieldset aria-label="Quick tags">
                            <div className="flex flex-wrap gap-2">
                                {TOPICS.map((t) => {
                                    const selected = selectedTopics.has(t.value)
                                    return (
                                        <Button
                                            key={t.value}
                                            type="button"
                                            variant="outline"
                                            aria-pressed={selected}
                                            onClick={() => toggleTopic(t.value)}
                                            className={cn(
                                                "h-9 rounded-full border",
                                                selected
                                                    ? "bg-primary text-primary-foreground border-transparent"
                                                    : "bg-secondary text-secondary-foreground",
                                            )}
                                        >
                                            {t.label}
                                        </Button>
                                    )
                                })}
                                {DIFFICULTIES.map((d) => {
                                    const selected = difficulty === d.value
                                    return (
                                        <Button
                                            key={d.value}
                                            type="button"
                                            variant="outline"
                                            aria-pressed={selected}
                                            onClick={() => selectSingle<Difficulty>(setDifficulty, difficulty, d.value)}
                                            className={cn(
                                                "h-9 rounded-full border",
                                                selected
                                                    ? "bg-primary text-primary-foreground border-transparent"
                                                    : "bg-secondary text-secondary-foreground",
                                            )}
                                        >
                                            {d.label}
                                        </Button>
                                    )
                                })}
                                {TIME_LIMITS.map((t) => {
                                    const selected = timeLimit === t.value
                                    return (
                                        <Button
                                            key={t.value}
                                            type="button"
                                            variant="outline"
                                            aria-pressed={selected}
                                            onClick={() => selectSingle<TimeLimit>(setTimeLimit, timeLimit, t.value)}
                                            className={cn(
                                                "h-9 rounded-full border",
                                                selected
                                                    ? "bg-primary text-primary-foreground border-transparent"
                                                    : "bg-secondary text-secondary-foreground",
                                            )}
                                        >
                                            {t.label}
                                        </Button>
                                    )
                                })}
                                {QUESTION_COUNTS.map((t) => {
                                    const selected = questionCount === t.value;
                                    return (
                                        <Button
                                            key={t.value}
                                            type="button"
                                            variant="outline"
                                            aria-pressed={selected}
                                            onClick={() => {
                                                setQuestionCount(t.value);
                                                setCustomCount("");
                                            }}
                                            className={cn(
                                                "h-9 rounded-full border",
                                                selected
                                                    ? "bg-primary text-primary-foreground border-transparent"
                                                    : "bg-secondary text-secondary-foreground",
                                            )}
                                        >
                                            {t.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </fieldset>

                        {isCustomSelected && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="customCount">Custom question count</Label>
                                <input
                                    id="customCount"
                                    type="number"
                                    min="1"
                                    value={customCount}
                                    onChange={(e) => setCustomCount(e.target.value)}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Enter number"
                                />
                            </div>
                        )}

                        {[...selectedTopics].map((topic) => (
                            <input key={topic} type="hidden" name="topics[]" value={topic} />
                        ))}
                        <input type="hidden" name="difficulty" value={difficulty ?? ""} />
                        <input type="hidden" name="timeLimit" value={timeLimit ?? ""} />
                        <input type="hidden" name="questionCount" value={resolvedCount} />

                        <div className="flex items-center justify-end gap-3">
                            <Button type="submit" className="text-xl px-6" disabled={createQuizQuery.isPending}>
                                {createQuizQuery.isPending ? "Generating..." : "Generate Quiz"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
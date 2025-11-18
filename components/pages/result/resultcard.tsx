"use client"

import { useQuery } from "@tanstack/react-query"
import { AlertCircle, CheckCircle2, XCircle, MinusCircle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getResult } from "@/actions/getResult"
import { useState } from "react"
import { getPerformanceMessage } from "@/lib/utils"
import { Question } from "@/lib/types"

type ResultResponse = {
    correct: Question[]
    notAnswered: Question[]
    incorrect: Question[]
    skipped: Question[]
    quizName: string
    creator: string
}

type CategoryType = "correct" | "incorrect" | "skipped" | "notAnswered"

export function ResultsView({ testId }: { testId: string }) {
    const [expandedCategories, setExpandedCategories] = useState<Set<CategoryType>>(new Set(["incorrect"]))
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

    const getResultQuery = useQuery<ResultResponse>({
        queryKey: ["result", testId],
        queryFn: () => getResult(testId),
    })

    if (getResultQuery.isError) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-2">
                        Could not load your results
                    </h1>
                </section>
            </main>
        )
    }

    if (getResultQuery.isPending) {
        return (
            <main className="min-h-dvh w-full bg-background p-4 flex items-center justify-center">
                <div className="w-full max-w-3xl space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
            </main>
        )
    }

    const data = getResultQuery.data
    const correct = data.correct ? (Array.isArray(data.correct) ? data.correct : [data.correct]) : []
    const incorrect = data.incorrect ? (Array.isArray(data.incorrect) ? data.incorrect : [data.incorrect]) : []
    const skipped = data.skipped ? (Array.isArray(data.skipped) ? data.skipped : [data.skipped]) : []
    const notAnswered = data.notAnswered || []
    const total = correct.length + incorrect.length + skipped.length + notAnswered.length
    const score = correct.length
    const percentage = Math.round((score / total) * 100)

    const toggleCategory = (category: CategoryType) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(category)) {
                newSet.delete(category)
            } else {
                newSet.add(category)
            }
            return newSet
        })
    }

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev)
            if (newSet.has(questionId)) {
                newSet.delete(questionId)
            } else {
                newSet.add(questionId)
            }
            return newSet
        })
    }

    const performanceMsg = getPerformanceMessage(percentage)

    const renderCategoryCard = (
        category: CategoryType,
        title: string,
        list: Question[],
        icon: React.ReactNode,
        color: string,
        bgColor: string,
        showUserAnswer: boolean = true,
        showCorrectAnswer: boolean = true
    ) => {
        if (!list.length) return null

        const isExpanded = expandedCategories.has(category)

        return (
            <div className={`rounded-xl border-2 ${color} ${bgColor} overflow-hidden transition-all`}>
                <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {icon}
                        <h2 className="text-lg font-bold">{title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-background/60 text-sm font-semibold">
                            {list.length}
                        </span>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {isExpanded && (
                    <div className="border-t-2 border-current/20 p-4 space-y-3 bg-background/30">
                        {list.map((q, idx) => {
                            const isQuestionExpanded = expandedQuestions.has(q.id)
                            return (
                                <div key={q.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => toggleQuestion(q.id)}
                                        className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {idx + 1}
                                            </span>
                                            <p className="font-medium flex-1">{q.question}</p>
                                            {isQuestionExpanded ? <ChevronUp className="h-4 w-4 mt-1" /> : <ChevronDown className="h-4 w-4 mt-1" />}
                                        </div>
                                    </button>

                                    {isQuestionExpanded && (
                                        <div className="px-3 pb-3 pt-1 space-y-2 text-sm border-t bg-muted/30">
                                            {showUserAnswer && (
                                                <div className="flex gap-2 ">
                                                    <span className="font-semibold text-muted-foreground min-w-fit">Your answer:</span>
                                                    <span className="font-medium">
                                                        {q.skip ? "Skipped" : q.options.find(o => o.userSelected)?.option || "Unknown"}
                                                    </span>
                                                </div>
                                            )}
                                            {showCorrectAnswer && (
                                                <div className="flex gap-2 border-b-2 pb-2">
                                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 min-w-fit">Correct answer:</span>
                                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                                        {q.options.find(o => o.correct)?.option}
                                                    </span>
                                                </div>
                                            )}
                                            {q.explanation && (
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        <span className="font-semibold">Explanation:</span> {q.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    return (
        <main className="min-h-dvh bg-background text-foreground py-8 px-4">
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4 bg-card rounded-2xl border shadow-sm p-6 md:p-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold">{data.quizName}</h1>
                        <p className="text-muted-foreground text-sm">Created by {data.creator}</p>
                    </div>

                    <div className={`text-2xl font-bold ${performanceMsg.color}`}>
                        {performanceMsg.text}
                    </div>

                    <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 border-2 border-primary/20">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-primary">{score}</span>
                            <span className="text-2xl text-muted-foreground font-medium">/ {total}</span>
                        </div>
                        <div className="h-8 w-px bg-border"></div>
                        <span className="text-lg font-semibold text-muted-foreground">
                            {percentage}%
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                        {[
                            { label: "Correct", value: correct.length, color: "text-emerald-600", icon: <CheckCircle2 className="h-4 w-4" /> },
                            { label: "Incorrect", value: incorrect.length, color: "text-red-600", icon: <XCircle className="h-4 w-4" /> },
                            { label: "Skipped", value: skipped.length, color: "text-gray-600", icon: <MinusCircle className="h-4 w-4" /> },
                            { label: "Not Answered", value: notAnswered.length, color: "text-amber-600", icon: <HelpCircle className="h-4 w-4" /> },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-muted/50 rounded-lg p-3 border">
                                <div className={`flex items-center gap-1.5 justify-center ${stat.color} mb-1`}>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    {stat.icon}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {renderCategoryCard(
                        "correct",
                        "Correct Answers",
                        correct,
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
                        "border-emerald-500/40",
                        "bg-emerald-500/5",
                        false,
                        false
                    )}
                    {renderCategoryCard(
                        "incorrect",
                        "Incorrect Answers",
                        incorrect,
                        <XCircle className="h-5 w-5 text-red-600" />,
                        "border-red-500/40",
                        "bg-red-500/5",
                        true,
                        true
                    )}
                    {renderCategoryCard(
                        "skipped",
                        "Skipped Questions",
                        skipped,
                        <MinusCircle className="h-5 w-5 text-gray-600" />,
                        "border-gray-500/40",
                        "bg-gray-500/5",
                        false,
                        true
                    )}
                    {renderCategoryCard(
                        "notAnswered",
                        "Not Answered",
                        notAnswered,
                        <HelpCircle className="h-5 w-5 text-amber-600" />,
                        "border-amber-500/40",
                        "bg-amber-500/5",
                        false,
                        true
                    )}
                </div>
            </div>
        </main>
    )
}
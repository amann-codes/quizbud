"use client"

import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, XCircle, MinusCircle, HelpCircle, ChevronDown, Trophy } from "lucide-react"
import { getResult } from "@/actions/getResult"
import { useState } from "react"
import { getPerformanceMessage, cn } from "@/lib/utils"
import { Question } from "@/lib/types"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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

    if (getResultQuery.isPending) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white py-12 px-4 relative overflow-hidden font-sans">
                <div className="w-full max-w-4xl mx-auto space-y-8 z-10 relative">
                    <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8 flex flex-col items-center gap-6 animate-pulse">
                        <div className="h-8 w-64 bg-zinc-800 rounded-full" />
                        <div className="h-40 w-40 rounded-full bg-zinc-800" />
                        <div className="h-10 w-32 bg-zinc-800 rounded-full" />
                        <div className="grid grid-cols-4 gap-4 w-full max-w-lg mt-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-zinc-800 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-zinc-900/30 rounded-xl border border-white/5 animate-pulse" />
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    if (getResultQuery.isError) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>
                <div className="relative z-10 w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Could Not Load Results</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                        We encountered an error processing your quiz results.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-red-900/10 hover:text-red-300 w-full">
                            Back to Home
                        </Button>
                    </Link>
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
            if (newSet.has(category)) newSet.delete(category)
            else newSet.add(category)
            return newSet
        })
    }

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const newSet = new Set(prev)
            if (newSet.has(questionId)) newSet.delete(questionId)
            else newSet.add(questionId)
            return newSet
        })
    }

    const performanceMsg = getPerformanceMessage(percentage)

    const getScoreColor = () => {
        if (percentage >= 80) return "text-emerald-400 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]";
        if (percentage >= 50) return "text-yellow-400 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]";
        return "text-red-400 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]";
    }

    const renderCategoryCard = (
        category: CategoryType,
        title: string,
        list: Question[],
        icon: React.ReactNode,
        themeColor: string,
        showUserAnswer: boolean = true,
        showCorrectAnswer: boolean = true
    ) => {
        if (!list.length) return null

        const isExpanded = expandedCategories.has(category)

        const borderClass = {
            emerald: "border-emerald-500/30 hover:border-emerald-500/50",
            red: "border-red-500/30 hover:border-red-500/50",
            zinc: "border-zinc-700 hover:border-zinc-500",
            amber: "border-amber-500/30 hover:border-amber-500/50",
        }[themeColor]

        const bgClass = {
            emerald: "bg-emerald-500/5",
            red: "bg-red-500/5",
            zinc: "bg-zinc-900/30",
            amber: "bg-amber-500/5",
        }[themeColor]

        return (
            <motion.div
                layout
                className={cn("rounded-2xl border overflow-hidden transition-colors duration-300", borderClass, bgClass)}
            >
                <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-5 flex items-center justify-between cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-full bg-black/20", themeColor === 'emerald' ? "text-emerald-400" : themeColor === 'red' ? "text-red-400" : themeColor === 'amber' ? "text-amber-400" : "text-zinc-400")}>
                            {icon}
                        </div>
                        <h2 className="text-lg font-bold text-white group-hover:text-white/90">{title}</h2>
                        <span className="px-3 py-1 rounded-full bg-black/40 text-sm font-bold text-white/80 border border-white/5">
                            {list.length}
                        </span>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-black/20"
                        >
                            <div className="p-4 space-y-3">
                                {list.map((q, idx) => {
                                    const isQuestionExpanded = expandedQuestions.has(q.id)
                                    return (
                                        <div key={q.id} className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                                            <button
                                                onClick={() => toggleQuestion(q.id)}
                                                className="w-full p-4 text-left hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-4"
                                            >
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-300 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <p className="font-medium flex-1 text-zinc-200 text-sm sm:text-base leading-relaxed">{q.question}</p>
                                                <ChevronDown className={cn("h-4 w-4 text-zinc-500 mt-1 transition-transform", isQuestionExpanded && "rotate-180")} />
                                            </button>

                                            <AnimatePresence>
                                                {isQuestionExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-4 pb-4 pt-0 pl-14 space-y-3 text-sm border-t border-white/5 bg-black/20 mt-2 py-4">
                                                            {showUserAnswer && (
                                                                <div className="flex gap-2">
                                                                    <span className="font-semibold text-zinc-400 min-w-fit">Your Answer:</span>
                                                                    <span className={cn("font-medium", category === 'correct' ? "text-emerald-400" : "text-red-400")}>
                                                                        {q.skip ? "Skipped" : q.options.find(o => o.userSelected)?.option || "Unknown"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {showCorrectAnswer && (
                                                                <div className="flex gap-2 pb-2">
                                                                    <span className="font-semibold text-emerald-500 min-w-fit">Correct Answer:</span>
                                                                    <span className="font-medium text-emerald-400">
                                                                        {q.options.find(o => o.correct)?.option}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {q.explanation && (
                                                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                                                                        <span className="font-semibold text-indigo-400 block mb-1">Explanation:</span>
                                                                        {q.explanation}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white py-12 px-4 relative overflow-x-hidden font-sans">
            <div className="absolute inset-0 z-0 pointer-events-none"><BackgroundBeams /></div>

            <div className="w-full max-w-4xl mx-auto space-y-8 z-10 relative">

                <div className="relative bg-zinc-900/60 backdrop-blur-xl rounded-[32px] border border-white/10 p-8 md:p-10 text-center shadow-2xl overflow-hidden">
                    <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-[100px] opacity-20 pointer-events-none",
                        percentage >= 50 ? "bg-emerald-500" : "bg-red-500")}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-6 space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{data.quizName}</h1>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
                                Created by {data.creator}
                            </div>
                        </div>

                        <div className={cn("relative flex items-center justify-center w-40 h-40 rounded-full border-4 bg-zinc-900 mb-6", getScoreColor())}>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-white">{percentage}%</span>
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">Score</span>
                            </div>
                            {percentage >= 80 && (
                                <div className="absolute -top-3 -right-3 bg-yellow-500 text-black p-2 rounded-full shadow-lg border-2 border-zinc-900">
                                    <Trophy className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        <div className={cn("text-xl md:text-2xl font-bold mb-8", percentage >= 50 ? "text-emerald-400" : "text-red-400")}>
                            {performanceMsg.text}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                            {[
                                { label: "Correct", value: correct.length, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 className="w-4 h-4" /> },
                                { label: "Incorrect", value: incorrect.length, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: <XCircle className="w-4 h-4" /> },
                                { label: "Skipped", value: skipped.length, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: <MinusCircle className="w-4 h-4" /> },
                                { label: "Unanswered", value: notAnswered.length, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <HelpCircle className="w-4 h-4" /> },
                            ].map((stat) => (
                                <div key={stat.label} className={cn("flex flex-col items-center justify-center p-4 rounded-2xl border backdrop-blur-sm", stat.bg, stat.border)}>
                                    <div className={cn("flex items-center gap-2 text-2xl font-bold mb-1", stat.color)}>
                                        {stat.value}
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {renderCategoryCard(
                        "correct",
                        "Correct Answers",
                        correct,
                        <CheckCircle2 className="h-5 w-5" />,
                        "emerald",
                        false,
                        false
                    )}
                    {renderCategoryCard(
                        "incorrect",
                        "Incorrect Answers",
                        incorrect,
                        <XCircle className="h-5 w-5" />,
                        "red",
                        true,
                        true
                    )}
                    {renderCategoryCard(
                        "skipped",
                        "Skipped Questions",
                        skipped,
                        <MinusCircle className="h-5 w-5" />,
                        "zinc",
                        false,
                        true
                    )}
                    {renderCategoryCard(
                        "notAnswered",
                        "Not Answered",
                        notAnswered,
                        <HelpCircle className="h-5 w-5" />,
                        "amber",
                        false,
                        true
                    )}
                </div>
            </div>
        </main>
    )
}
"use client"

import { FormEvent, useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Topic, Difficulty, TimeLimit, QuesitonsLimit } from "@/lib/types"
import { TOPICS, DIFFICULTIES, TIME_LIMITS, QUESTION_COUNTS } from "@/lib/tags"
import { useMutation } from "@tanstack/react-query"
import { createQuiz } from "@/actions/createQuiz"
import { ChevronRight, ChevronLeft, Loader2, Sparkles, Clock } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button as MovingBorderButton } from "@/components/ui/moving-border"
import { Separator } from "@/components/ui/separator"

type Step = 1 | 2 | 3

const MIN_CUSTOM_QUESTIONS = 5
const MAX_CUSTOM_QUESTIONS = 50

const CUSTOM_TIME_MIN = 2
const CUSTOM_TIME_MAX = 60
const CUSTOM_TIME_STEP = 1

export default function QuizForm() {
    const [step, setStep] = useState<Step>(1)
    const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set())
    const [difficulty, setDifficulty] = useState<Difficulty | undefined>()
    const [timeLimit, setTimeLimit] = useState<TimeLimit | undefined>()
    const [customTime, setCustomTime] = useState<number | undefined>()
    const [questionCount, setQuestionCount] = useState<QuesitonsLimit | undefined>()
    const [customCount, setCustomCount] = useState<string>("")

    const getCompletionProgress = (): number => {
        let score = 0
        if (selectedTopics.size > 0) score += 25
        if (difficulty) score += 25
        if (timeLimit || customTime) score += 25
        if (questionCount || (customCount && !isNaN(parseInt(customCount)))) score += 25
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

    const selectSingle = <T extends string>(
        setter: (v: T | undefined) => void,
        current: T | undefined,
        value: T
    ) => {
        setter(current === value ? undefined : value)
    }

    const createQuizQuery = useMutation({
        mutationFn: createQuiz,
        onSuccess: (id) => {
            window.location.href = `/quiz/${id}`
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3) as Step)
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as Step)

    const canProceed = () => {
        switch (step) {
            case 1:
                return selectedTopics.size > 0
            case 2:
                return !!difficulty && (!!timeLimit || !!customTime)
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
        if (!canProceed() || !difficulty) return

        const topicsArray = Array.from(selectedTopics)
        const finalQuestionCount = customCount ? parseInt(customCount) : questionCount!
        const finalTimeLimit = customTime ? `${customTime}m` as TimeLimit : timeLimit!

        createQuizQuery.mutate({
            topics: topicsArray,
            difficulty,
            timeLimit: finalTimeLimit,
            questionCount: finalQuestionCount,
        })
    }

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col md:items-center md:justify-center bg-neutral-950 overflow-x-hidden text-white font-sans pt-24 pb-32 px-4 md:py-10">
            <div className="absolute inset-0 z-0">
                <BackgroundBeams />
            </div>

            <div className={`relative z-10 w-full max-w-2xl ${createQuizQuery.isPending ? "pointer-events-none " : ""}`}>
                <div className="rounded-3xl bg-white/10 backdrop-blur-md border-t border-l border-white/20 border-b border-r shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300 min-h-[400px] flex flex-col p-5 sm:p-8 md:p-10">

                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-sm">
                                Generate Quiz
                            </h1>
                            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 border border-white/10 px-2 py-1 rounded-md bg-black/20">
                                Step {step} / 3
                            </span>
                        </div>

                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
                        <AnimatePresence mode="wait" custom={step}>
                            <motion.div
                                key={step}
                                custom={step}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex-1 flex flex-col gap-6"
                            >
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 drop-shadow-md">Select Topics</h2>
                                            <p className="text-xs sm:text-sm text-zinc-400">Choose the domains you want to master.</p>
                                        </div>
                                        <div className="sm:grid sm:grid-cols-2 flex flex-wrap gap-3">
                                            {TOPICS.map(t => {
                                                const selected = selectedTopics.has(t.value)
                                                return (
                                                    <div
                                                        key={t.value}
                                                        onClick={() => toggleTopic(t.value)}
                                                        className={cn(
                                                            "relative group w-max sm:w-full cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300 active:scale-[0.98]",
                                                            selected
                                                                ? "border-indigo-500/50 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                                                                : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <span className={cn("font-medium text-base", selected ? "text-indigo-200" : "text-zinc-300")}>
                                                                {t.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 drop-shadow-md">Difficulty Level</h2>
                                            <div className="grid grid-cols-3 gap-3">
                                                {DIFFICULTIES.map(d => {
                                                    const selected = difficulty === d.value
                                                    return (
                                                        <div
                                                            key={d.value}
                                                            onClick={() => selectSingle(setDifficulty, difficulty, d.value)}
                                                            className={cn(
                                                                "cursor-pointer rounded-xl border p-3 sm:p-4 text-center transition-all duration-200 active:scale-[0.98]",
                                                                selected
                                                                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                                                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/20"
                                                            )}
                                                        >
                                                            <span className="capitalize font-medium text-sm sm:text-base">{d.label}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 drop-shadow-md">Time Limit</h2>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {TIME_LIMITS.map(t => {
                                                    const selected = timeLimit === t.value
                                                    return (
                                                        <div
                                                            key={t.value}
                                                            onClick={() => {
                                                                selectSingle(setTimeLimit, timeLimit, t.value)
                                                                setCustomTime(undefined)
                                                            }}
                                                            className={cn(
                                                                "cursor-pointer rounded-xl border p-3 sm:p-3 text-center transition-all duration-200 active:scale-[0.98]",
                                                                selected
                                                                    ? "border-pink-500 bg-pink-500/20 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                                                                    : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/20"
                                                            )}
                                                        >
                                                            <span className="font-medium text-sm">{t.label}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                <Separator className="flex-1 bg-white/10 h-[1px]" />
                                                <span className="shrink-0 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-600">OR</span>
                                                <Separator className="flex-1 bg-white/10 h-[1px]" />
                                            </div>

                                            <div className={cn(
                                                "p-5 rounded-xl border transition-all duration-300 backdrop-blur-sm",
                                                customTime
                                                    ? "bg-pink-500/10 border-pink-500/30 shadow-[inset_0_0_20px_rgba(236,72,153,0.05)]"
                                                    : "bg-black/20 border-white/5"
                                            )}>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className={cn("w-4 h-4", customTime ? "text-pink-400" : "text-zinc-500")} />
                                                        <label className="text-sm font-medium text-zinc-300">
                                                            Custom Duration
                                                        </label>
                                                    </div>
                                                    <span className={cn(
                                                        "text-xl font-bold font-mono transition-colors",
                                                        customTime ? "text-pink-400" : "text-zinc-600"
                                                    )}>
                                                        {customTime ?? "--"} min
                                                    </span>
                                                </div>

                                                <Slider
                                                    value={customTime ? [customTime] : [30]}
                                                    onValueChange={(v) => {
                                                        const minutes = v[0]
                                                        setCustomTime(minutes)
                                                        setTimeLimit(undefined)
                                                    }}
                                                    min={CUSTOM_TIME_MIN}
                                                    max={CUSTOM_TIME_MAX}
                                                    step={CUSTOM_TIME_STEP}
                                                    className="
                                                        [&>.relative]:bg-black/50 
                                                        [&>.relative>.absolute]:bg-pink-500 
                                                        [&_[role=slider]]:border-pink-500
                                                        [&_[role=slider]]:bg-zinc-950
                                                        [&_[role=slider]]:ring-offset-zinc-950
                                                        [&_[role=slider]]:hover:border-pink-400
                                                    "
                                                />

                                                <div className="flex justify-between text-[10px] text-zinc-600 uppercase tracking-wider mt-4 font-medium">
                                                    <span>{CUSTOM_TIME_MIN} min</span>
                                                    <span>{CUSTOM_TIME_MAX} min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 drop-shadow-md">Question Count</h2>
                                            <p className="text-xs sm:text-sm text-zinc-400">How long do you want this test to be?</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {QUESTION_COUNTS.map(t => {
                                                const selected = questionCount === t.value
                                                return (
                                                    <div
                                                        key={t.value}
                                                        onClick={() => {
                                                            setQuestionCount(t.value)
                                                            setCustomCount("")
                                                        }}
                                                        className={cn(
                                                            "cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center transition-all duration-200 gap-1 active:scale-[0.98]",
                                                            selected
                                                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                                : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/20"
                                                        )}
                                                    >
                                                        <span className="text-xl font-bold">{t.value.replace('q', '')}</span>
                                                        <span className="text-[10px] uppercase tracking-wider text-center">Questions</span>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <label className="text-sm font-medium text-zinc-300 mb-3 block">
                                                Custom Amount ({MIN_CUSTOM_QUESTIONS}-{MAX_CUSTOM_QUESTIONS})
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Enter a number..."
                                                min={MIN_CUSTOM_QUESTIONS}
                                                max={MAX_CUSTOM_QUESTIONS}
                                                value={customCount}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (value === "") {
                                                        setCustomCount("")
                                                        setQuestionCount(undefined)
                                                        return
                                                    }
                                                    const num = Number(value)
                                                    if (isNaN(num)) return
                                                    if (num < MIN_CUSTOM_QUESTIONS) setCustomCount(String(MIN_CUSTOM_QUESTIONS))
                                                    else if (num > MAX_CUSTOM_QUESTIONS) setCustomCount(String(MAX_CUSTOM_QUESTIONS))
                                                    else setCustomCount(String(num))
                                                    setQuestionCount(undefined)
                                                }}
                                                className="bg-black/20 border-white/10 text-zinc-200 focus:ring-emerald-500 focus:border-emerald-500 h-12 text-lg backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-8 pt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1}
                                className={cn(
                                    "flex items-center text-sm font-medium cursor-pointer transition-colors hover:text-white disabled:opacity-0 px-3 py-2",
                                    step === 1 ? "invisible" : "text-zinc-400"
                                )}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Back
                            </button>

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className={cn(
                                        "flex items-center px-6 py-2 cursor-pointer rounded-full font-medium text-base transition-all duration-300",
                                        canProceed()
                                            ? "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10"
                                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    )}
                                >
                                    Next Step
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </button>
                            ) : (
                                <MovingBorderButton
                                    borderRadius="1.75rem"
                                    type="submit"
                                    disabled={createQuizQuery.isPending || !canProceed()}
                                    className={cn(
                                        "bg-zinc-900 text-white border-neutral-200 dark:border-slate-800 cursor-pointer font-semibold text-base",
                                        (!canProceed() || createQuizQuery.isPending) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <div className="flex items-center gap-2 px-4">
                                        {createQuizQuery.isPending ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-5 w-5 text-indigo-400" />
                                        )}
                                        {createQuizQuery.isPending ? "Generating..." : "Generate Quiz"}
                                    </div>
                                </MovingBorderButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
"use client"
import { useState } from "react"
import { ClipboardList, Clock, Play, Share2, Sparkles, AlertTriangle, ChevronRight, Loader2 } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllQuiz } from "@/actions/getAllQuiz"
import { createTest } from "@/actions/createTest"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { toHMS, cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function Quizzes() {
    const [isStarting, setIsStarting] = useState(false)

    const getQuizQuery = useQuery({
        queryKey: ["quiz"],
        queryFn: getAllQuiz,
    })

    if (getQuizQuery.isPending) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex flex-col pt-24 pb-32 px-4 sm:px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 z-10">

                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48 bg-zinc-800" />
                            <Skeleton className="h-4 w-64 bg-zinc-800/50" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded-full bg-zinc-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[220px] rounded-3xl bg-zinc-900/40 border border-white/5 p-6 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                                        <Skeleton className="h-4 w-1/2 bg-zinc-800/50" />
                                    </div>

                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16 rounded-md bg-zinc-800/30" />
                                        <Skeleton className="h-6 w-16 rounded-md bg-zinc-800/30" />
                                    </div>
                                </div>
                                <div className="mt-auto flex gap-3 pt-4 border-t border-white/5">
                                    <Skeleton className="h-9 w-1/2 rounded-md bg-zinc-800" />
                                    <Skeleton className="h-9 w-1/2 rounded-md bg-zinc-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        )
    }
    if (getQuizQuery.isError) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <BackgroundBeams />
                </div>
                <div className="relative z-10 w-full max-w-md bg-zinc-900/30 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Error Loading Quizzes</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                        We encountered an issue while fetching your data. <br /> Check your connection and try again.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline"
                        className="border-red-500/30 text-red-400 cursor-pointer hover:bg-red-500/10 bg-red-900/10 hover:text-red-300 w-full">
                        Try Again
                    </Button>
                </div>
            </main>
        )
    }

    if (getQuizQuery.data?.length === 0) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <BackgroundBeams />
                </div>
                <div className="relative z-10 w-full max-w-lg bg-zinc-900/20 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/50 mb-6 ring-1 ring-white/10 shadow-inner">
                        <ClipboardList className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">
                        No quizzes yet
                    </h1>
                    <p className="text-zinc-400 mb-8 leading-relaxed max-w-sm mx-auto">
                        You haven&apos;t created any quizzes. Master a new domain by generating your first quiz now.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/generate">
                            <Button className="rounded-full bg-white text-black cursor-pointer hover:bg-zinc-200 px-8 py-6 text-base font-semibold shadow-lg shadow-white/10 transition-all hover:scale-105">
                                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                                Create Quiz
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={cn(
            "min-h-screen w-full flex flex-col pt-24 pb-32 px-4 sm:px-8 bg-neutral-950 relative overflow-x-hidden",
            isStarting &&
            "pointer-events-none opacity-80 select-none grayscale-[0.5]"
        )}>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <div className="relative z-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Your Quizzes</h1>
                        <p className="text-zinc-400 mt-1 text-sm">Manage and attempt your generated quizzes.</p>
                    </div>
                    <Link href="/generate">
                        <Button className="rounded-full bg-white text-black cursor-pointer hover:bg-zinc-200 font-medium px-6 shadow-lg shadow-white/5 transition-transform hover:scale-105">
                            + New Quiz
                        </Button>
                    </Link>
                </header>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                >
                    {getQuizQuery.data?.map((q) => (
                        <QuizCard
                            key={q.id}
                            id={q.id}
                            name={q.name}
                            questions={q.questions}
                            timeLimit={q.timeLimit}
                            setIsStarting={setIsStarting}
                        />
                    ))}
                </motion.div>
            </div>
        </main>
    )
}

interface QuizCardProps {
    id: string
    name: string
    questions: number
    timeLimit: number
    setIsStarting: (value: boolean) => void
}

const QuizCard = ({ id, name, questions, timeLimit, setIsStarting }: QuizCardProps) => {
    const router = useRouter()
    const { h } = toHMS(timeLimit * 60000)

    const createQuizQuery = useMutation({
        mutationFn: () => createTest(id),
        onMutate: () => setIsStarting(true),
        onSettled: () => setIsStarting(false),
        onSuccess: (testId) => {
            if (typeof testId === "string") router.push(`/test/${testId}`)
            else toast.error("Failed to start quiz. Please try again.")
        },
        onError: () => {
            toast.error("An unexpected error occurred. Please try again.")
        },
    })

    const handleStartQuiz = (e: React.MouseEvent) => {
        e.stopPropagation()
        createQuizQuery.mutate()
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const url = typeof window !== "undefined" ? `${window.location.origin}/quiz/${id}` : ""
        try {
            await navigator.clipboard.writeText(url)
            toast.success("Quiz link copied to clipboard")
        } catch {
            toast.error("Failed to copy link.")
        }
    }

    const handleViewQuiz = () => {
        router.push(`/quiz/${id}`)
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <motion.div variants={item} className="h-full">
            <div
                className="group relative h-full flex flex-col justify-between rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-900 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
                <div className="space-y-4 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-lg text-zinc-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                            {name}
                        </h3>
                        <span
                            onClick={handleViewQuiz}
                            className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full cursor-pointer bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-xs font-medium text-zinc-400 group-hover:border-zinc-600 transition-colors">
                            <ClipboardList className="h-3.5 w-3.5" />
                            <span>{questions} Qs</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-xs font-medium text-zinc-400 group-hover:border-zinc-600 transition-colors">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{h} Mins</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                    <Button
                        onClick={handleStartQuiz}
                        disabled={createQuizQuery.isPending}
                        className="flex-1 bg-white text-black cursor-pointer hover:bg-zinc-200 font-semibold h-9 text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                        {createQuizQuery.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                        )}
                        {createQuizQuery.isPending ? "Starting..." : "Start"}
                    </Button>

                    <Button
                        onClick={handleShare}
                        variant="outline"
                        disabled={createQuizQuery.isPending}
                        className="flex-1 border-zinc-700 cursor-pointer bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white h-9 text-xs sm:text-sm transition-all active:scale-95"
                    >
                        <Share2 className="mr-2 h-3.5 w-3.5" />
                        Share
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
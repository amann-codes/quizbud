"use client"

import { useRouter } from "next/navigation"
import { Play, Share2, Loader2, AlertTriangle, ArrowLeft, User, HelpCircle, CheckCircle2 } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getQuiz } from "@/actions/getQuiz";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createTest } from "@/actions/createTest"
import { GetQuizActionResult } from "@/lib/types";
import { BackgroundBeams } from "@/components/ui/background-beams"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function QuizCard({ id }: { id: string }) {

    const router = useRouter()

    const getQuizQuery = useQuery({
        queryKey: ['quizData', id],
        queryFn: (): Promise<GetQuizActionResult> => getQuiz(id)
    })

    const createQuizQuery = useMutation({
        mutationFn: () => createTest(id),
        onSuccess: (testId) => {
            if (typeof testId === 'string') {
                router.push(`/test/${testId}`)
            } else {
                console.error("Failed to create test:", testId);
                toast.error("Failed to start quiz. Please try again.")
            }
        },
        onError: (error) => {
            console.error("Error creating test:", error);
            toast.error("An unexpected error occurred. Please try again.")
        }
    })

    const handleStartQuiz = () => {
        createQuizQuery.mutate();
    }

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : ""
        try {
            await navigator.clipboard.writeText(url)
            toast.success("Quiz link copied to clipboard")
        } catch (e) {
            console.error("Failed to copy link:", e);
            toast.error("Failed to copy link.");
        }
    }

    const isCreatingTest = createQuizQuery.isPending;

    if (getQuizQuery.isError) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>

                <div className="relative z-10 w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                        The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Button onClick={() => router.push('/')} variant="outline" className="border-zinc-700 cursor-pointer text-zinc-300 hover:bg-zinc-800 bg-zinc-950 hover:text-white w-full gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Button>
                </div>
            </main>
        );
    }

    if (getQuizQuery.isPending) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-20 relative overflow-hidden">
                <div className="w-full max-w-3xl bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 flex flex-col items-center animate-pulse">
                    <div className="h-6 w-32 bg-zinc-800 rounded-full mb-6" />
                    <div className="h-12 w-3/4 bg-zinc-800 rounded-lg mb-4" />
                    <div className="h-5 w-48 bg-zinc-800/50 rounded-lg mb-12" />

                    <div className="flex gap-4 w-full sm:w-auto mb-12">
                        <div className="h-12 w-32 bg-zinc-800 rounded-lg" />
                        <div className="h-12 w-32 bg-zinc-800 rounded-lg" />
                    </div>

                    <div className="w-full h-32 bg-zinc-800/30 rounded-xl border border-white/5" />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-24 pb-12 relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "relative z-10 w-full max-w-3xl bg-zinc-900/40 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-6 sm:p-12 overflow-hidden",
                    isCreatingTest && "pointer-events-none"
                )}
            >

                <header className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{getQuizQuery.data?.questions} Questions</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                        {getQuizQuery.data?.name}
                    </h1>

                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <div className="p-1 rounded-full bg-zinc-800">
                            <User className="w-3 h-3" />
                        </div>
                        <span>
                            Created by <span className="text-zinc-200 font-medium">{getQuizQuery.data?.creator?.name || 'Anonymous'}</span>
                        </span>
                    </div>
                </header>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                    <Button
                        onClick={handleStartQuiz}
                        disabled={isCreatingTest}
                        className="w-full sm:w-auto h-12 px-8 rounded-xl cursor-pointer bg-white text-black hover:bg-zinc-200 text-base font-semibold shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95"
                    >
                        {isCreatingTest ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Play className="mr-2 h-5 w-5 fill-current" />
                        )}
                        {isCreatingTest ? "Preparing..." : "Start Quiz"}
                    </Button>

                    <Button
                        onClick={handleShare}
                        disabled={isCreatingTest}
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 rounded-xl cursor-pointer border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white text-base transition-all active:scale-95"
                    >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                    </Button>
                </div>

                {getQuizQuery.data.expect && (
                    <div className="rounded-2xl bg-black/20 border border-white/5 p-6 sm:p-8">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            What to Expect
                        </h2>
                        <div className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                            {getQuizQuery.data.expect}
                        </div>
                    </div>
                )}
            </motion.div>
        </main>
    )
}
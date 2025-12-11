"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllTest } from '@/actions/getAllTest';
import { createTest } from '@/actions/createTest';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Clock,
    Share2,
    User,
    History,
    Sparkles,
    ArrowRight,
    RotateCcw,
    Loader2,
    FileQuestion
} from 'lucide-react';
import { toHMS } from '@/lib/utils';
import { QuizInstanceInTest } from '@/lib/types';

import { BackgroundBeams } from '@/components/ui/background-beams';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function Tests() {
    const [isStarting, setIsStarting] = useState(false);

    const getTestQuery = useQuery({
        queryKey: ['test'],
        queryFn: getAllTest
    });

    if (getTestQuery.isPending) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex flex-col pt-24 pb-32 px-4 sm:px-8 relative overflow-hidden font-sans">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 z-10">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 bg-zinc-800 rounded-md" />
                        <Skeleton className="h-4 w-64 bg-zinc-800/50 rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-full min-h-[220px] rounded-3xl bg-zinc-900/40 border border-zinc-800 p-6 flex flex-col justify-between">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-2 w-full">
                                            <Skeleton className="h-6 w-3/4 bg-zinc-800 rounded-md" />
                                            <Skeleton className="h-6 w-1/2 bg-zinc-800 rounded-md" />
                                        </div>
                                        <Skeleton className="h-8 w-8 bg-zinc-800 rounded-full shrink-0" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Skeleton className="h-8 w-full bg-zinc-800/50 rounded-lg" />
                                        <Skeleton className="h-8 w-full bg-zinc-800/50 rounded-lg" />
                                        <Skeleton className="h-8 w-full bg-zinc-800/50 rounded-lg col-span-2" />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-zinc-800">
                                    <Skeleton className="h-10 w-1/2 bg-zinc-800 rounded-xl" />
                                    <Skeleton className="h-10 w-1/2 bg-zinc-800 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (getTestQuery.isError) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>
                <div className="relative z-10 w-full max-w-md bg-zinc-900/30 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Error Loading History</h1>
                    <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                        We could&apos;t fetch your test history. Please check your connection.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer bg-red-900/10 hover:text-red-300 w-full">
                        Try Again
                    </Button>
                </div>
            </main>
        );
    }

    if (getTestQuery.data?.length === 0) {
        return (
            <main className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>
                <div className="relative z-10 w-full max-w-lg bg-zinc-900/20 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/50 mb-6 ring-1 ring-white/10 shadow-inner">
                        <History className="h-10 w-10 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">
                        No Tests Taken Yet
                    </h1>
                    <p className="text-zinc-400 mb-8 leading-relaxed max-w-sm mx-auto">
                        You haven&apos;t attempted any tests. Start by taking a quiz to test your aptitude.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/generate">
                            <Button className="rounded-full cursor-pointer bg-white text-black hover:bg-zinc-200 px-8 py-6 text-base font-semibold shadow-lg shadow-white/10 transition-all hover:scale-105">
                                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                                Start a Quiz
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full flex flex-col pt-24 pb-32 px-4 sm:px-8 bg-neutral-950 relative overflow-x-hidden font-sans">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <BackgroundBeams />
            </div>

            <AnimatePresence>
                {isStarting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl flex flex-col items-center shadow-2xl">
                            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                            <h3 className="text-xl font-bold text-white">Starting Quiz</h3>
                            <p className="text-zinc-400 text-sm mt-2">Preparing your test environment...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Test History</h1>
                        <p className="text-zinc-400 mt-1 text-sm">Review your past performance and retake quizzes.</p>
                    </div>
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
                    {getTestQuery.data?.map((q) => (
                        <TestCard
                            key={q.id}
                            id={q.id}
                            quiz={q.quiz}
                            questions={q.questions.length}
                            timeLimit={q.quiz.timeLimit}
                            setIsStarting={setIsStarting}
                        />
                    ))}
                </motion.div>
            </div>
        </main>
    );
}

interface QuizCardProps {
    id: string;
    quiz: QuizInstanceInTest;
    questions: number;
    timeLimit: number;
    setIsStarting: (value: boolean) => void;
}

const TestCard = ({ id, quiz, questions, setIsStarting }: QuizCardProps) => {
    const router = useRouter();
    const { h } = toHMS(quiz.timeLimit * 60000);

    const createTestQuery = useMutation({
        mutationFn: () => createTest(quiz.id),
        onMutate: () => setIsStarting(true),
        onSettled: () => setIsStarting(false),
        onSuccess: (testId) => {
            if (typeof testId === "string") router.push(`/test/${testId}`);
            else toast.error("Failed to start quiz. Please try again.");
        },
        onError: () => {
            toast.error("An unexpected error occurred. Please try again.");
        },
    });

    const handleStartQuiz = (e: React.MouseEvent) => {
        e.stopPropagation();
        createTestQuery.mutate();
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = typeof window !== "undefined" ? `${process.env.NEXT_PUBLIC_URL}/quiz/${quiz.id}` : "";
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Quiz link copied to clipboard");
        } catch {
            toast.error("Failed to copy link.");
        }
    };

    const handleViewResult = () => {
        router.push(`/result/${id}`)
    }

    const itemVariant = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <motion.div variants={itemVariant} className="h-full">
            <div
                className="group relative h-full flex flex-col justify-between rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-900 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
                <div className="space-y-4 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-lg text-zinc-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                            {quiz.name}
                        </h3>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleShare}
                            className="h-8 w-8 rounded-full text-zinc-500 cursor-pointer hover:text-indigo-400 hover:bg-indigo-500/10"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/30 p-2 rounded-lg border border-white/5">
                            <User className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="truncate">{quiz.creator.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/30 p-2 rounded-lg border border-white/5">
                            <FileQuestion className="h-3.5 w-3.5 text-zinc-500" />
                            <span>{questions} Qs</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/30 p-2 rounded-lg border border-white/5">
                            <Clock className="h-3.5 w-3.5 text-zinc-500" />
                            <span>{h} Minutes Duration</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                    <Button
                        onClick={handleStartQuiz}
                        disabled={createTestQuery.isPending}
                        className="flex-1 bg-white text-black cursor-pointer hover:bg-zinc-200 font-semibold h-10 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95"
                    >
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                        Retake
                    </Button>
                    <Button
                        onClick={handleViewResult}
                        variant="outline"
                        disabled={createTestQuery.isPending}
                        className="flex-1 border-zinc-700 bg-transparent cursor-pointer text-zinc-300 hover:bg-zinc-800 hover:text-white h-10 rounded-xl text-xs sm:text-sm transition-all active:scale-95"
                    >
                        View Result
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
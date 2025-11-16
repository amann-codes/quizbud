"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ClipboardIcon, ClipboardList, Clock, Share2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createTest } from '@/actions/createTest';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAllTest } from '@/actions/getAllTest';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { QuizInstanceInTest } from '@/lib/types';
import { useState } from 'react';

export function Tests() {
    const [isStarting, setIsStarting] = useState(false);
    const getTestQuery = useQuery({
        queryKey: ['test'],
        queryFn: getAllTest
    });
    if (getTestQuery.isError) {
        return (
            <main className="min-h-dvh w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-2">
                        There was an error getting your test attempts
                    </h1>
                </section>
            </main>
        );
    }
    if (getTestQuery.isPending) {
        return (
            <div className="min-h-dvh w-full flex flex-col p-4 bg-background gap-6 sm:gap-8">
                <Skeleton className="h-8 w-48 sm:h-10 sm:w-80" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="flex flex-col overflow-hidden">
                            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                                <Skeleton className="h-5 w-32 sm:h-6 sm:w-40" />
                                <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-14 sm:w-16" />
                                    <Skeleton className="h-4 w-16 sm:w-20" />
                                </div>
                            </div>
                            <div className="mt-auto p-4 sm:p-5 flex flex-col sm:flex-row gap-2">
                                <Skeleton className="h-9 flex-1" />
                                <Skeleton className="h-9 sm:w-20 flex-1 sm:flex-none" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    if (getTestQuery.data?.length === 0) {
        return (
            <main className="min-h-dvh w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-2">
                        No Tests yet
                    </h1>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        You haven’t attempted any tests. Start testing your aptitude.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
                        >
                            Create Quiz
                        </Link>
                    </div>
                </section>
            </main>
        );
    }
    return (
        <div className={`min-h-dvh w-full flex flex-col p-4 bg-background gap-6 sm:gap-8 ${isStarting ? "pointer-events-none opacity-50 select-none" : ""}`}>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Tests</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {getTestQuery.data?.map((q, index) => (
                    <TestCard
                        key={index}
                        id={q.id}
                        quiz={q.quiz}
                        questions={q.questions.length}
                        timeLimit={q.timeLimit}
                        setIsStarting={setIsStarting}
                    />
                ))}
            </div>
        </div>
    );
}

interface QuizCardProps {
    id: string;
    quiz: QuizInstanceInTest;
    questions: number;
    timeLimit: number;
    setIsStarting: (value: boolean) => void;
}

const TestCard = ({ id, quiz, questions, timeLimit, setIsStarting }: QuizCardProps) => {
    const router = useRouter();
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
    const handleStartQuiz = () => createTestQuery.mutate();
    const handleShare = async () => {
        const url = typeof window !== "undefined" ? `${process.env.NEXT_PUBLIC_URL}/quiz/${quiz.id}` : "";
        try {
            await navigator.clipboard.writeText(url);
            toast("Quiz link copied to clipboard");
        } catch {
            toast.error("Failed to copy link.");
        }
    };
    const handleViewResult = () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}/result/${id}` : ""
        router.push(url)
    }

    return (
        <Card className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
            <CardHeader className="pb-3 flex items-start justify-between">
                <CardTitle className="flex flex-col sm:flex-row sm:justify-between text-base sm:text-lg font-semibold gap-2 flex-1 cursor-pointer" >
                    <span className="truncate">{quiz.name}</span>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <UserRound className="h-3.5 w-3.5" />
                        <span className="truncate">{quiz.creator.name}</span>
                    </div>
                </CardTitle>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 -mr-2"
                    onClick={handleShare}
                    disabled={createTestQuery.isPending}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="cursor-pointer space-y-2 text-xs sm:text-sm text-muted-foreground flex-1 pb-3">
                <div className="flex items-center gap-2">
                    <ClipboardIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{timeLimit} min</span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row w-full gap-2 pt-3">
                <Button onClick={handleStartQuiz} className="w-full sm:w-1/2 text-sm" disabled={createTestQuery.isPending}>
                    {createTestQuery.isPending ? "Starting..." : "Retake"}
                </Button>
                <Button onClick={handleViewResult} variant="outline" className="w-full sm:w-1/2 text-sm" disabled={createTestQuery.isPending}>
                    View Result
                </Button>
            </CardFooter>
        </Card>
    );
};
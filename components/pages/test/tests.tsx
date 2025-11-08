"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ClipboardIcon, ClipboardList, Clock, UserRound } from 'lucide-react';
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
    })
    if (getTestQuery.isError) {
        return (
            <main className="min-h-dvh w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        There was an error getting your test attempts
                    </h1>
                </section>
            </main>
        )
    }

    if (getTestQuery.isPending) {
        return (
            <div className="min-h-screen w-full flex flex-col p-4 bg-background gap-8">
                <Skeleton className="w-80 h-10 my-4" />
                <div className="grid grid-cols-3 gap-3 w-full">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} className="flex flex-col overflow-hidden">
                            <div className="p-5 space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <div className="mt-auto p-5 flex gap-2">
                                <Skeleton className="h-9 flex-1" />
                                <Skeleton className="h-9 w-20" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (getTestQuery.data?.length === 0) {
        return (
            <main className="min-h-dvh w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <ClipboardList className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        No Tests yet
                    </h1>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        You haven’t attempeted any tests. Start testing your aptitude.
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
        )
    }

    return (
        <div
            className={`min-h-screen w-full flex flex-col p-4 bg-background gap-8 ${isStarting ? "pointer-events-none opacity-50 select-none" : ""
                }`}
        >
            <h1 className="text-3xl font-bold my-4">Your Tests</h1>
            <div className="grid grid-cols-3 gap-3 w-full">
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
    )
}

interface QuizCardProps {
    id: string
    quiz: QuizInstanceInTest
    questions: number
    timeLimit: number
    setIsStarting: (value: boolean) => void
}

const TestCard = ({ id, quiz, questions, timeLimit, setIsStarting }: QuizCardProps) => {
    const router = useRouter()

    const createTestQuery = useMutation({
        mutationFn: () => createTest(quiz.id),
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

    const handleStartQuiz = () => createTestQuery.mutate()

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? `${process.env.NEXT_PUBLIC_URL}/quiz/${quiz.id}` : ""
        try {
            await navigator.clipboard.writeText(url)
            toast("Quiz link copied to clipboard")
        } catch {
            toast.error("Failed to copy link.")
        }
    }

    const handleViewQuiz = () => {
        const url = typeof window !== "undefined" ? `${window.location.href}/${id}` : ""
        router.push(url)
    }

    return (
        <Card className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="cursor-pointer" onClick={handleViewQuiz}>
                <CardTitle className="flex justify-between text-lg font-semibold"><span>
                    {quiz.name}
                </span>
                    <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" />
                        <span>{quiz.creator.name}</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent onClick={handleViewQuiz} className="cursor-pointer space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <ClipboardIcon className="h-4 w-4" />
                    <span>{questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{timeLimit} min</span>
                </div>
            </CardContent>
            <CardFooter className="flex w-full gap-3">
                <Button onClick={handleStartQuiz} className="w-1/2" disabled={createTestQuery.isPending}>
                    {createTestQuery.isPending ? "Starting..." : "Retake"}
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-1/2" disabled={createTestQuery.isPending}>
                    Share
                </Button>
            </CardFooter>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ClipboardIcon, ClipboardList, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllQuiz } from "@/actions/getAllQuiz"
import { createTest } from "@/actions/createTest"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function Quizzes() {
    const [isStarting, setIsStarting] = useState(false)

    const getQuizQuery = useQuery({
        queryKey: ["quiz"],
        queryFn: getAllQuiz,
    })

    if (getQuizQuery.isError) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        There was an error getting your quizzes
                    </h1>
                </section>
            </main>
        )
    }

    if (getQuizQuery.isPending) {
        return (
            <div className="h-full w-full flex flex-col p-4 bg-background gap-8">
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

    if (getQuizQuery.data?.length === 0) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <ClipboardList className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        No quizzes yet
                    </h1>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        You haven’t created any quizzes. Start by making one now.
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
            className={`h-full w-full flex flex-col p-4 bg-background gap-8 ${isStarting ? "pointer-events-none opacity-50 select-none" : ""
                }`}
        >
            <h1 className="text-3xl font-bold my-4">Quiz Created by You</h1>
            <div className="grid grid-cols-3 gap-3 w-full">
                {getQuizQuery.data?.map((q, index) => (
                    <QuizCard
                        key={index}
                        id={q.id}
                        name={q.name}
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
    name: string
    questions: number
    timeLimit: number
    setIsStarting: (value: boolean) => void
}

const QuizCard = ({ id, name, questions, timeLimit, setIsStarting }: QuizCardProps) => {
    const router = useRouter()

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

    const handleStartQuiz = () => createQuizQuery.mutate()

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? `${window.location.href}/${id}` : ""
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
                <CardTitle className="text-lg font-semibold">{name}</CardTitle>
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
                <Button onClick={handleStartQuiz} className="w-1/2" disabled={createQuizQuery.isPending}>
                    {createQuizQuery.isPending ? "Starting..." : "Start"}
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-1/2" disabled={createQuizQuery.isPending}>
                    Share
                </Button>
            </CardFooter>
        </Card>
    )
}

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
import { toHMS } from "@/lib/utils"

export function Quizzes() {
    const [isStarting, setIsStarting] = useState(false)

    const getQuizQuery = useQuery({
        queryKey: ["quiz"],
        queryFn: getAllQuiz,
    })

    if (getQuizQuery.isError) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-2">
                        There was an error getting your quizzes
                    </h1>
                </section>
            </main>
        )
    }

    if (getQuizQuery.isPending) {
        return (
            <main className="h-full w-full flex flex-col p-4 sm:m-0 mt-12 bg-background gap-6 sm:gap-8">
                <Skeleton className="h-8 w-48 sm:h-10 sm:w-80" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-4 w-full"
                        >
                            <Skeleton className="h-6 w-40 sm:h-7 sm:w-64 mb-4" />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 flex-shrink-0" />
                                    <Skeleton className="h-4 w-20" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 flex-shrink-0" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Skeleton className="h-10 w-full sm:w-1/2" />
                                <Skeleton className="h-10 w-full sm:w-1/2" />
                            </div>
                        </div>
                    ))}

                </div>
            </main>
        )
    }

    if (getQuizQuery.data?.length === 0) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-card text-card-foreground p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-center mb-6">
                        <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-2">
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
        <main className={`h-full w-full flex flex-col p-4 bg-background gap-6 sm:gap-8 ${isStarting ? "pointer-events-none opacity-50 select-none" : ""}`}>
            <h1 className="text-2xl sm:text-3xl font-bold">Quiz Created by You</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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

    const handleStartQuiz = () => createQuizQuery.mutate()
    const handleShare = async () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}/quiz/${id}` : ""
        try {
            await navigator.clipboard.writeText(url)
            toast("Quiz link copied to clipboard")
        } catch {
            toast.error("Failed to copy link.")
        }
    }
    const handleViewQuiz = () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}/quiz/${id}` : ""
        router.push(url)
    }

    return (
        <Card className="rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
            <CardHeader className="cursor-pointer pb-3" onClick={handleViewQuiz}>
                <CardTitle className="text-base sm:text-lg font-semibold truncate">{name}</CardTitle>
            </CardHeader>
            <CardContent onClick={handleViewQuiz} className="cursor-pointer space-y-2 text-xs sm:text-sm text-muted-foreground flex-1 pb-3">
                <div className="flex items-center gap-2">
                    <ClipboardIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{h} minutes</span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row w-full gap-2 pt-3">
                <Button onClick={handleStartQuiz} className="w-full sm:w-1/2 text-sm" disabled={createQuizQuery.isPending}>
                    {createQuizQuery.isPending ? "Starting..." : "Start"}
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-full sm:w-1/2 text-sm" disabled={createQuizQuery.isPending}>
                    Share
                </Button>
            </CardFooter>
        </Card>
    )
}
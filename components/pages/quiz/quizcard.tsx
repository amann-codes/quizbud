"use client"

import { useRouter } from "next/navigation"
import { Play, Share2, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getQuiz } from "@/actions/getQuiz";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createTest } from "@/actions/createTest"
import { GetQuizActionResult } from "@/lib/types";

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
            toast("Quiz link copied to clipboard")
        } catch (e) {
            console.error("Failed to copy link:", e);
            toast.error("Failed to copy link.");
        }
    }

    const isLoadingData = getQuizQuery.isLoading;
    const isCreatingTest = createQuizQuery.isPending;
    const isDisabled = isLoadingData || isCreatingTest;

    if (getQuizQuery.isError) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
                        Quiz Not Found
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <div className="flex justify-center">
                        <Button onClick={() => router.push('/')} className="w-full sm:w-auto px-6 py-3 gap-2">
                            <ArrowLeft className="h-5 w-5" />
                            Back to Home
                        </Button>
                    </div>
                </section>
            </main>
        );
    }

    if (getQuizQuery.isPending) {
        return (
            <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
                <section className="w-full max-w-3xl rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
                    <header className="text-center border-b pb-6 mb-8">
                        <Skeleton className="inline-block h-6 w-28 rounded-full" />
                        <Skeleton className="h-10 w-80 mx-auto mt-2" />
                        <Skeleton className="h-5 w-48 mx-auto mt-2" />
                    </header>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                        <div className="flex w-full sm:w-auto items-center gap-2 px-6 py-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex w-full sm:w-auto items-center gap-2 px-6 py-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    <div>
                        <Skeleton className="h-7 w-36 mb-4" />
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="h-full w-full bg-background text-foreground flex items-center justify-center p-4">
            <section
                className={`w-full max-w-3xl rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8 transition-opacity ${isDisabled ? 'opacity-50 pointer-events-none' : ''
                    }`}
                aria-disabled={isDisabled}
            >
                <header className="text-center border-b pb-6 mb-8">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {getQuizQuery.data?.questions.length} Questions
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 text-balance">
                        {getQuizQuery.data?.name}
                    </h1>

                    <p className="text-muted-foreground mt-2">
                        {getQuizQuery.data?.creator?.name
                            ? `Created by ${getQuizQuery.data?.creator.name}`
                            : 'Anonymous Creator'}
                    </p>

                </header>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                    <Button
                        onClick={handleStartQuiz}
                        className="w-full sm:w-auto gap-2 px-6 py-3"
                        disabled={isCreatingTest}
                    >
                        {isCreatingTest ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Play className="h-5 w-5" />
                        )}
                        {isCreatingTest ? "Starting..." : "Start Quiz"}
                    </Button>
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full sm:w-auto gap-2 px-6 py-3"
                        disabled={isCreatingTest}
                    >
                        <Share2 className="h-5 w-5" />
                        Share
                    </Button>
                </div>

                <div>
                    {
                        getQuizQuery.data.expect &&
                        <>
                            <h2 className="text-lg font-semibold mb-4">
                                What to Expect
                            </h2>
                            <ul className="space-y-3">
                                {isLoadingData ? (
                                    <Skeleton className="bg-gray-300 h-12 w-full rounded-md" />
                                ) : (
                                    <div className="rounded-md border bg-muted/30 p-4">{getQuizQuery.data.expect}</div>
                                )}
                            </ul>
                        </>
                    }
                </div>
            </section>
        </main >
    )
}


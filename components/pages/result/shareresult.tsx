"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Trophy, Clock, User, Calendar, Share2, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Test, SelectedAnswers, TimePerQuestion, Option, Question } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface EncodedData {
  test: Test
  answers: SelectedAnswers
  timeData: TimePerQuestion
  userName: string
  completedAt: string
}

export const ViewResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [results, setResults] = useState<EncodedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const encoded = searchParams.get("data")
    if (!encoded) {
      setError("No results data found in URL.")
      return
    }

    try {
      const decoded = decodeURIComponent(atob(encoded))
      const data = JSON.parse(decoded) as EncodedData
      setResults(data)
    } catch {
      setError("Invalid or corrupted results link.")
    }
  }, [searchParams])

  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Results link copied to clipboard!")
      }).catch(() => {
        toast.error("Failed to copy.", { description: url, duration: 10000 })
      })
    } else {
      toast("Copy this link:", { description: url, duration: 15000 })
    }
  }

  if (error) {
    return (
      <main className="min-h-dvh w-full flex items-center justify-center bg-background text-foreground p-4">
        <section className="w-full max-w-lg rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Result Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The result you’re looking for doesn’t exist or may have been removed.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-6 py-3 gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Button>
        </section>
      </main>

    )
  }

  if (!results) {
    return (
      <main className="min-h-dvh w-full flex items-center justify-center bg-background text-foreground p-4">
        <section className="w-full max-w-lg rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="h-12 w-12 text-muted-foreground animate-pulse" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Loading Quiz...</h1>
          <p className="text-muted-foreground mb-6">
            Please wait while we fetch your quiz data.
          </p>
          <div className="space-y-3 text-left">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-muted/30 p-4 flex items-center justify-between"
              >
                <Skeleton className="h-5 w-3/5 rounded-md" />
                <Skeleton className="h-5 w-10 rounded-md" />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
        </section>
      </main>
    )
  }

  const { test, answers, timeData, userName, completedAt } = results

  const calculateCorrectCount = () => {
    let count = 0
    test.questions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.correct)
      if (correctOption) {
        const correctOptionId = correctOption.id
        const userAnswer = answers[q.id]
        if (userAnswer === correctOptionId) {
          count++
        }
      }
    })
    return count
  }

  const correct = calculateCorrectCount()
  const percentage = Math.round((correct / test.questions.length) * 100)
  const totalTime = Object.values(timeData).reduce((a, b) => a + b, 0)

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const getCorrectOptionId = (q: Question) => {
    const correctOption = q.options.find((opt: Option) => opt.correct)
    return correctOption ? correctOption.id : null
  }

  return (
    <div className="min-h-dvh bg-background p-4 flex flex-col items-center">
      <Card className="w-full max-w-4xl mt-16 shadow-lg">
        <CardHeader className="text-center pb-8 border-b">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Trophy className={`w-12 h-12 ${percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600"}`} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{test.name}</CardTitle>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {userName}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(completedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(totalTime)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary">{percentage}%</div>
            <p className="text-lg text-muted-foreground mt-2">
              {correct} out of {test.questions.length} correct
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Breakdown</h3>
            {test.questions.map((q, i) => {
              const userAnswer = answers[q.id]
              const correctOptionId = getCorrectOptionId(q)
              const isCorrect = userAnswer === correctOptionId
              const timeSpent = timeData[q.id] ?? 0
              const correctOption = correctOptionId ? q.options.find((o: Option) => o.id === correctOptionId) : null

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-red-500 bg-red-50 dark:bg-red-950/20"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Q{i + 1}: {q.question}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <strong>Your answer:</strong>{" "}
                      {userAnswer ? q.options.find((o: Option) => o.id === userAnswer)?.option || "Unknown" : "Skipped"}
                    </p>
                    {!isCorrect && correctOption && (
                      <p>
                        <strong>Correct answer:</strong> {correctOption.option}
                      </p>
                    )}
                    <p className="text-xs">Time spent: {formatTime(timeSpent)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-5 pt-6 border-t">
            <Button onClick={() => router.push('/')} className="w-full sm:w-auto px-6 py-3 gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
            <Button
              variant={"outline"}
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
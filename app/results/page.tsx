import { ViewResult } from "@/components/pages/result/shareresult"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Trophy, View } from "lucide-react"
import { Suspense } from "react"

export default function ResultsPage() {
    return <Suspense fallback={<main className="min-h-dvh w-full flex items-center justify-center bg-background text-foreground p-4">
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
    </main>}>
        <ViewResult />
    </Suspense>
}
"use client"

import { getLeaderBoard } from "@/actions/getLeaderboard"
import { useQuery } from "@tanstack/react-query"
import { ArrowUp, ArrowDown, AlertCircle, Crown, Medal, Trophy, Users, CircleSmallIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface LeaderboardEntry {
    name: string
    image: string
    score: number
    currentRank: number
    previousRank: number
}

function getRankChange(category: "up" | "down" | "same") {
    if (category === "up")
        return {
            icon: ArrowUp,
            border: "border-emerald-500/50",
            bg: "bg-emerald-500/5",
            text: "text-emerald-600",
            badgeBg: "bg-emerald-500/10",
        }
    if (category === "down")
        return {
            icon: ArrowDown,
            border: "border-red-500/50",
            bg: "bg-red-500/5",
            text: "text-red-600",
            badgeBg: "bg-red-500/10",
        }
    return {
        icon: CircleSmallIcon,
        border: "border-gray-500/40",
        bg: "bg-gray-500/5",
        text: "text-gray-600",
        badgeBg: "bg-gray-500/10",
    }
}

export function Leaderboard() {
    const session = useSession();
    const { data = [], isPending, isError } = useQuery<LeaderboardEntry[]>({
        queryKey: ["leaderboard"],
        queryFn: getLeaderBoard,
    })

    if (isError) {
        return (
            <div className="flex min-h-96 items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg">
                    <div className="mx-auto mb-6 flex justify-center">
                        <AlertCircle className="h-14 w-14 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Failed to load leaderboard
                    </h2>
                    <p className="mt-2 text-muted-foreground">Please try again later.</p>
                </div>
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="space-y-4 max-w-2xl mx-auto p-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-5 rounded-2xl border-2 border-transparent bg-card p-6 shadow-lg"
                    >
                        <Skeleton className="sm:flex hidden h-14 w-14 rounded-full" />
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Skeleton className="hidden sm:flex h-8 w-20" />
                            <Skeleton className="hidden sm:flex h-8 w-10" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (data.length === 0 && !isPending) {
        return (
            <div className="flex min-h-96 flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="rounded-full bg-muted/50 p-8">
                    <Users className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">No one on the leaderboard yet</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Be the first to complete a quiz and claim the top spot!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-2xl mt-12 mx-auto mb-12 p-4">
            {data.map((entry, index) => {
                const change = entry.currentRank < entry.previousRank ? "up" : entry.currentRank > entry.previousRank ? "down" : "same"
                const rankStyle = getRankChange(change)
                const Icon = rankStyle.icon
                const isTop3 = entry.currentRank <= 3

                return (
                    <div
                        key={index}
                        className={`
              relative overflow-hidden rounded-2xl border-2 ${rankStyle.border} ${rankStyle.bg}
               hover:shadow-xl transition-all duration-200
            `}
                    >
                        {isTop3 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent pointer-events-none" />
                        )}

                        <div className="flex items-center gap-5 sm:p-6 p-3">
                            <div
                                className={`
                  relative grid sm:h-14 sm:w-14 h-10 w-10 place-items-center sm:rounded-2xl rounded-lg font-black sm:text-2xl text-xl sm:px-5 shadow-lg
                  ${entry.currentRank === 1
                                        ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
                                        : entry.currentRank === 2
                                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                                            : entry.currentRank === 3
                                                ? "bg-gradient-to-br from-orange-400 to-red-600 text-white"
                                                : "bg-muted text-foreground"
                                    }
                `}
                            >
                                {entry.currentRank}
                                {entry.currentRank === 1 && <Crown className="absolute -top-3 -right-3 h-8 w-8 text-yellow-500" />}
                                {entry.currentRank === 2 && <Medal className="absolute -top-3 -right-3 h-7 w-7 text-gray-400" />}
                                {entry.currentRank === 3 && <Trophy className="absolute -top-3 -right-3 h-7 w-7 text-orange-500" />}
                            </div>
                            <div><Avatar className="sm:size-12 size-10 border rounded-lg">
                                {entry.name != "" && (
                                    < AvatarImage src={entry.image} />
                                )}
                                <AvatarFallback className="border rounded-lg sm:text-xl text-lg p-1 font-bold">
                                    {entry.name && getInitials(entry.name)}
                                </AvatarFallback>
                            </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="sm:text-xl text-lg font-bold text-foreground truncate">{entry.name}</p>
                                {change !== "same" && (
                                    <p className={`sm:text-sm text-xs font-medium mt-1 ${rankStyle.text}`}>
                                        {change === "up" ? "Up" : "Down"} {Math.abs(entry.currentRank - entry.previousRank)} position{Math.abs(entry.currentRank - entry.previousRank) > 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>

                            <div className="text-center">
                                <p className="sm:text-sm text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</p>
                                <p className="sm:text-3xl sm:font-extrabold text-xl font-bold text-foreground">{entry.score.toLocaleString()}</p>
                            </div>
                            <div className={`hidden sm:flex h-14 w-14 items-center justify-center rounded-full ${rankStyle.badgeBg} backdrop-blur-sm`}>
                                <Icon className={`h-8 w-8 ${rankStyle.text}`} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
import {
    ArrowUp,
    ArrowDown,
    Crown,
    Medal,
    Trophy,
    CircleSmallIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LeaderboardEntry } from "@/lib/types";

interface RawEntry {
    name: string;
    image: string;
    score: number;
    currentRank: number;
    previousRank: number;
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

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
    const change = entry.currentRank < entry.prevRank ? "up" : entry.currentRank > entry.prevRank ? "down" : "same"
    const rankStyle = getRankChange(change)
    const Icon = rankStyle.icon
    const isTop3 = entry.currentRank <= 3

    return (
        <div
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

                <Avatar className="sm:size-12 size-10 border rounded-lg">
                    {entry.name !== "" && <AvatarImage src={entry.image} />}
                    <AvatarFallback className="border rounded-lg sm:text-xl text-lg p-1 font-bold">
                        {entry.name && getInitials(entry.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                        {entry.name}
                    </p>
                    {change !== "same" && (
                        <p className={`mt-1 text-xs font-medium sm:text-sm ${rankStyle.text}`}>
                            {change === "up" ? "Up" : "Down"}{" "}
                            {Math.abs(entry.currentRank - entry.prevRank)} position
                            {Math.abs(entry.currentRank - entry.prevRank) > 1 ? "s" : ""}
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                        Score
                    </p>
                    <p className="text-xl font-bold text-foreground sm:font-extrabold sm:text-3xl">
                        {entry.score.toLocaleString()}
                    </p>
                </div>

                <div
                    className={`hidden sm:flex h-14 w-14 items-center justify-center rounded-full ${rankStyle.badgeBg} backdrop-blur-sm`}
                >
                    <Icon className={`h-8 w-8 ${rankStyle.text}`} strokeWidth={3} />
                </div>
            </div>
        </div>
    );
}
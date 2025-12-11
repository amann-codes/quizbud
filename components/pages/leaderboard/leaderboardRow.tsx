import {
    ArrowUp,
    ArrowDown,
    Crown,
    Medal,
    Trophy,
    Minus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/lib/types";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function getRankChange(category: "up" | "down" | "same") {
    if (category === "up")
        return {
            icon: ArrowUp,
            text: "text-emerald-400",
            bg: "bg-emerald-500/10",
            label: "Up"
        }
    if (category === "down")
        return {
            icon: ArrowDown,
            text: "text-red-400",
            bg: "bg-red-500/10",
            label: "Down"
        }
    return {
        icon: Minus,
        text: "text-zinc-500",
        bg: "bg-zinc-500/10",
        label: "No change"
    }
}

export function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
    const change = entry.currentRank < entry.prevRank ? "up" : entry.currentRank > entry.prevRank ? "down" : "same"
    const rankStyle = getRankChange(change)
    const Icon = rankStyle.icon

    const isTop1 = entry.currentRank === 1;
    const isTop2 = entry.currentRank === 2;
    const isTop3 = entry.currentRank === 3;
    const isTopRank = isTop1 || isTop2 || isTop3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                isTop1 ? "bg-yellow-500/5 border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]" :
                    isTop2 ? "bg-zinc-300/5 border-zinc-300/20 shadow-[0_0_30px_rgba(212,212,216,0.1)]" :
                        isTop3 ? "bg-orange-500/5 border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]" :
                            "bg-zinc-900/40 border-white/5 hover:bg-zinc-800/50 hover:border-white/10"
            )}
        >
            {isTopRank && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50 pointer-events-none" />
            )}

            <div className="flex items-center gap-4 p-4 relative z-10">
                <div
                    className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-2xl font-black text-xl shadow-lg shrink-0",
                        isTop1 ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white" :
                            isTop2 ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-white" :
                                isTop3 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                                    "bg-zinc-800 text-zinc-400 border border-white/5"
                    )}
                >
                    {entry.currentRank}
                    {isTop1 && <Crown className="absolute -top-2 -right-2 h-5 w-5 text-yellow-500 fill-yellow-500 drop-shadow-lg" />}
                    {isTop2 && <Medal className="absolute -top-2 -right-2 h-5 w-5 text-gray-300 fill-gray-300 drop-shadow-lg" />}
                    {isTop3 && <Trophy className="absolute -top-2 -right-2 h-5 w-5 text-orange-500 fill-orange-500 drop-shadow-lg" />}
                </div>
                <Avatar className={cn("h-10 w-10 border-2", isTopRank ? "border-white/20" : "border-zinc-700")}>
                    {entry.image && <AvatarImage src={entry.image} />}
                    <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold">
                        {entry.name && getInitials(entry.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <p className={cn("truncate text-base font-bold", isTopRank ? "text-white" : "text-zinc-200")}>
                        {entry.name}
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Icon className={cn("w-3 h-3", rankStyle.text)} />
                        <span className={cn("text-xs font-medium", rankStyle.text)}>
                            {change === "same" ? "No change" : (
                                <>
                                    {rankStyle.label} {Math.abs(entry.currentRank - entry.prevRank)}
                                </>
                            )}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Score</p>
                    <p className={cn("text-lg font-black tabular-nums", isTopRank ? "text-white" : "text-zinc-300")}>
                        {entry.score.toLocaleString()}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function LeaderboardTable({ data }: { data: LeaderboardEntry[] }) {
    return (
        <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="w-[100px] text-center text-zinc-400 font-semibold">Rank</TableHead>
                        <TableHead className="text-zinc-400 font-semibold">User</TableHead>
                        <TableHead className="text-zinc-400 font-semibold">Trend</TableHead>
                        <TableHead className="text-right text-zinc-400 font-semibold pr-8">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((entry) => {
                        const change = entry.currentRank < entry.prevRank ? "up" : entry.currentRank > entry.prevRank ? "down" : "same"
                        const rankStyle = getRankChange(change)
                        const Icon = rankStyle.icon

                        const isTop1 = entry.currentRank === 1;
                        const isTop2 = entry.currentRank === 2;
                        const isTop3 = entry.currentRank === 3;

                        return (
                            <TableRow
                                key={entry.name}
                                className="border-white/5 hover:bg-white/5 transition-colors group"
                            >
                                <TableCell className="text-center font-medium">
                                    <div className="flex justify-center">
                                        <div className={cn(
                                            "relative flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm",
                                            isTop1 ? "bg-yellow-500/20 text-yellow-500" :
                                                isTop2 ? "bg-zinc-400/20 text-zinc-300" :
                                                    isTop3 ? "bg-orange-500/20 text-orange-500" :
                                                        "text-zinc-500 bg-zinc-800/50"
                                        )}>
                                            {entry.currentRank}
                                            {isTop1 && <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                                            {isTop2 && <Medal className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-zinc-300 fill-zinc-300" />}
                                            {isTop3 && <Trophy className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-orange-500 fill-orange-500" />}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-zinc-800">
                                            {entry.image && <AvatarImage src={entry.image} />}
                                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-bold">
                                                {entry.name && getInitials(entry.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className={cn("font-medium", (isTop1 || isTop2 || isTop3) ? "text-white" : "text-zinc-300")}>
                                            {entry.name}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent", rankStyle.bg, rankStyle.text)}>
                                        <Icon className="w-3 h-3" />
                                        <span>
                                            {change === "same" ? "-" : Math.abs(entry.currentRank - entry.prevRank)}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-right pr-8">
                                    <span className={cn("font-mono font-bold text-lg", (isTop1 || isTop2 || isTop3) ? "text-white" : "text-zinc-400")}>
                                        {entry.score.toLocaleString()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
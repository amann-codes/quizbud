"use client";

import { getOrgLeaderboard } from "@/actions/getOrgLeaderboard";
import { getGlobalLeaderBoard } from "@/actions/getGlobalLeaderboard";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AlertTriangle, Trophy, Globe, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardEntry } from "@/lib/types";
import { LeaderboardRow, LeaderboardTable } from "./leaderboardRow";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";

function LeaderboardList({ data }: { data: LeaderboardEntry[] }) {
    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="pb-20 w-full">
            <div className="block md:hidden space-y-4">
                {data.map((entry, index) => (
                    <LeaderboardRow key={`${entry.name}-${entry.currentRank}`} entry={entry} index={index} />
                ))}
            </div>
            <div className="hidden md:block">
                <LeaderboardTable data={data} />
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="space-y-4 max-w-5xl mx-auto w-full pt-8">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-5 rounded-2xl border border-white/5 bg-zinc-900/40 p-5 shadow-lg animate-pulse"
                >
                    <Skeleton className="h-14 w-14 rounded-2xl bg-zinc-800" />
                    <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-40 bg-zinc-800" />
                        <Skeleton className="h-3 w-24 bg-zinc-800" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Skeleton className="h-3 w-10 bg-zinc-800" />
                        <Skeleton className="h-6 w-16 bg-zinc-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
            <div className="rounded-full bg-red-500/10 p-6 mb-6 border border-red-500/20">
                <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
            <p className="text-zinc-400 max-w-xs mx-auto mb-6">
                Something went wrong while fetching the data. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                Retry
            </Button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="rounded-full bg-zinc-800/50 p-6 mb-6 ring-1 ring-white/10">
                <Trophy className="h-10 w-10 text-zinc-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
                Leaderboard Empty
            </h2>
            <p className="text-zinc-400 max-w-sm mx-auto">
                No scores have been recorded yet. Be the first to take a quiz and claim the throne!
            </p>
        </div>
    );
}

export function LeaderboardPage() {
    const { data: session } = useSession();
    const isOrgAccount = session?.user?.email?.endsWith(".org") ?? false;
    const org = String(session?.user?.email).split("@")[1];

    const globalQuery = useQuery<LeaderboardEntry[]>({
        queryKey: ["global-leaderboard"],
        queryFn: getGlobalLeaderBoard,
    });

    const orgQuery = useQuery<LeaderboardEntry[]>({
        queryKey: ["org-leaderboard"],
        queryFn: () => getOrgLeaderboard({ org }),
        enabled: isOrgAccount,
    });

    if (globalQuery.isError || (isOrgAccount && orgQuery.isError)) {
        return (
            <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 z-0"><BackgroundBeams /></div>
                <div className="relative z-10 w-full max-w-2xl">
                    <ErrorState message="Failed to load leaderboard" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center pt-24 pb-12 px-4 relative overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none"><BackgroundBeams /></div>

            <div className="relative z-10 w-full max-w-2xl md:max-w-4xl lg:max-w-5xl">
                {isOrgAccount ? (
                    <Tabs defaultValue="global" className="w-full">
                        <div className="flex flex-col items-center mb-8">
                            <TabsList className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full">
                                <TabsTrigger
                                    value="global"
                                    className="rounded-full px-6 py-2.5 text-sm sm:text-base cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all"
                                >
                                    <Globe className="w-4 h-4 mr-2" /> Global
                                </TabsTrigger>
                                <TabsTrigger
                                    value="org"
                                    className="rounded-full px-6 py-2.5 text-sm sm:text-base cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all"
                                >
                                    <Building2 className="w-4 h-4 mr-2" /> Organization
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="global">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-2">
                                    Global leaderboard
                                </h1>
                                <p className="text-zinc-400">Top quiz masters from around the world</p>
                            </div>

                            {globalQuery.isPending ? <LoadingState /> : <LeaderboardList data={globalQuery.data || []} />}
                        </TabsContent>

                        <TabsContent value="org">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-2">
                                    {org.split(".")[0].charAt(0).toUpperCase() + org.split(".")[0].slice(1)} Leaderboard
                                </h1>
                                <p className="text-zinc-400">Top performers within your organization</p>
                            </div>

                            {orgQuery.isPending ? <LoadingState /> : <LeaderboardList data={orgQuery.data || []} />}
                        </TabsContent>
                    </Tabs>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                                <Trophy className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                                Global Leaderboard
                            </h1>
                            <p className="text-lg text-zinc-400 max-w-md mx-auto">
                                See where you stand among the top performers worldwide.
                            </p>
                        </div>

                        {globalQuery.isPending ? <LoadingState /> : <LeaderboardList data={globalQuery.data || []} />}
                    </>
                )}
            </div>
        </main>
    );
}
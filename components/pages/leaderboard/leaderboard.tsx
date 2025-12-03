"use client";

import { getOrgLeaderboard } from "@/actions/getOrgLeaderboard";
import { getGlobalLeaderBoard } from "@/actions/getGlobalLeaderboard";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AlertCircle, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardEntry } from "@/lib/types";
import { LeaderboardRow } from "./leaderboardRow";



function LeaderboardList({ data }: { data: LeaderboardEntry[] }) {
    if (data.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            {data.map((entry) => (
                <LeaderboardRow key={`${entry.name}-${entry.currentRank}`} entry={entry} />
            ))}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="space-y-4 max-w-2xl mx-auto p-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-5 rounded-2xl border-2 border-transparent bg-card p-6 shadow-lg"
                >
                    <Skeleton className="hidden sm:block h-14 w-14 rounded-full" />
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="hidden sm:flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex min-h-96 items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg">
                <div className="mx-auto mb-6 flex justify-center">
                    <AlertCircle className="h-14 w-14 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {message}
                </h2>
                <p className="mt-2 text-muted-foreground">Please try again later.</p>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex min-h-96 flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="rounded-full bg-muted/50 p-8">
                <Users className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    No one on the leaderboard yet
                </h2>
                <p className="text-muted-foreground max-w-sm">
                    Be the first to complete a quiz and claim the top spot!
                </p>
            </div>
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
        queryKey: ["org-leaderboard",],
        queryFn: () => getOrgLeaderboard({ org }),
    });

    if (globalQuery.isError || (isOrgAccount && orgQuery.isError)) {
        return <ErrorState message="Failed to load leaderboard" />;
    }

    if (globalQuery.isPending || (isOrgAccount && orgQuery.isPending)) {
        return <LoadingState />;
    }

    if (!globalQuery.data || (isOrgAccount && !orgQuery.data)) {
        return <EmptyState />;
    }

    const globalData = globalQuery.data;
    const orgData = orgQuery.data ?? [];

    return (
        <div className="max-w-2xl mx-auto p-4 mb-12">
            {isOrgAccount ? (
                <Tabs defaultValue="global">
                    <TabsList className="mx-auto py-6 px-3">
                        <TabsTrigger value="org" className="px-9 py-4 text-xl">
                            Organization
                        </TabsTrigger>
                        <TabsTrigger value="global" className="px-9 py-4 text-xl">
                            Global
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="global" className="mt-8">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1">
                            Global Leaderboard
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The top performers across all quizzes worldwide
                        </p>

                        <LeaderboardList data={globalData} />
                    </TabsContent>

                    <TabsContent value="org" className="mt-8">
                        {orgData.length > 0 ? (
                            <>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1">
                                    Organization Leaderboard
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    Ranking the best performers inside <span className="font-semibold">{org.split(".")[0].charAt(0).toUpperCase() + org.split(".")[0].slice(1)}</span>
                                </p>

                                <LeaderboardList data={orgData} />
                            </>
                        ) : (
                            <EmptyState />
                        )}
                    </TabsContent>
                </Tabs>
            ) : (
                <>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1">
                        Global Leaderboard
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        The top performers across all quizzes worldwide
                    </p>
                    <LeaderboardList data={globalData} />
                </>
            )}
        </div>
    );
}
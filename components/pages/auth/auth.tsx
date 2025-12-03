"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export function AuthPage() {
    const { status } = useSession();

    if (status === "authenticated") {
        redirect("/");
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-4">
            <div className="absolute inset-0">
                <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="relative backdrop-blur-xl bg-background/70 border border-border/50 rounded-3xl p-10 shadow-2xl hover:shadow-primary/10 transition-shadow duration-500">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Welcome to QuizBud
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Sign in to track your progress and climb the leaderboard
                        </p>
                    </div>
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="group relative w-full flex items-center justify-center gap-3 rounded-2xl px-8 py-5 font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all duration-400 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                        <img
                            src="https://authjs.dev/img/providers/google.svg"
                            alt="Google"
                            className="w-6 h-6"
                        />
                        Continue with Google
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 skew-x-12" />
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AuthPage() {
    const { status } = useSession();

    if (status === "authenticated") {
        redirect("/");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-xs space-y-6 bg-white p-8 border border-gray-300 rounded-lg shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Welcome back</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Sign in with your Google
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full flex items-center justify-center cursor-pointer gap-3 h-11 px-6 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition font-medium"
                    >
                        <img
                            src="https://authjs.dev/img/providers/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
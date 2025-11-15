"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LogIn } from "lucide-react";
import Link from "next/link";

export function UserButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link href={'/signin'}>
                <div className="flex gap-2">
                    <span className="ml-2 text-sm">Sign In</span>
                    <LogIn className="size-5" />
                </div>
            </Link>
        )
    }

    return (
        <>
            <Avatar className="size-7 rounded-lg">
                {session.user.image && (
                    <AvatarImage className="border" src={session.user.image} />
                )}
                <AvatarFallback className="border rounded-lg">
                    {session.user.name && getInitials(session.user.name)}
                </AvatarFallback>
            </Avatar>
        </>
    )
}
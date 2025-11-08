"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LogIn } from "lucide-react";

export function UserButton({ isOpen }: { isOpen: boolean }) {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <>
                <LogIn className="size-5" />
                {isOpen && <span className="ml-2 text-sm">Sign In</span>}
            </>
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
            {isOpen && (
                <span className="ml-2 truncate text-sm font-semibold">
                    {session.user.name}
                </span>
            )}
        </>
    )
}
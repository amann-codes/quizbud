"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LogIn, LogOut, User, Sparkles } from "lucide-react";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link href={'/signin'}>
                <button className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-4 font-medium text-zinc-300 shadow-xl transition-all duration-300 hover:bg-zinc-800 hover:text-white hover:ring-1 hover:ring-indigo-500/50 hover:ring-offset-1 hover:ring-offset-zinc-950">
                    <span className="mr-2 text-sm font-semibold">Sign In</span>
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </button>
            </Link>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full ring-offset-zinc-950 transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 focus:outline-none">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                        {session.user.image ? (
                            <AvatarImage
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                className="object-cover"
                            />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
                            {session.user.name ? getInitials(session.user.name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-60 overflow-hidden rounded-xl border border-zinc-800 bg-black/80 p-1 text-zinc-300 backdrop-blur-xl shadow-2xl"
            >
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                        <p className="text-xs leading-none text-zinc-500 truncate">{session.user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-400 focus:bg-red-500/10 focus:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
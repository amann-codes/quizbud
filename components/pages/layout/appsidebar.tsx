'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@/components/pages/layout/userbutton';
import { useSession, signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ClipboardCheck, History, LogOutIcon, Wand } from "lucide-react";

const nav = [
    {
        title: "Generate Quiz",
        loc: "/",
        icon: <Wand />
    }, {
        title: "Your Quizzes",
        loc: "/quiz",
        icon: <History />
    }, {
        title: "Test History",
        icon: <ClipboardCheck />,
        loc: '/test'
    }
]

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const { data: session } = useSession();
    const isOpen = state === 'expanded';

    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                <SidebarMenu className='mt-2'>
                    {nav.map((n, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                asChild
                                tooltip={n.title}
                                isActive={pathname === n.loc}
                            >
                                <Link href={n.loc}>
                                    {n.icon}
                                    <span className='text-base'>{n.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter
                className={`flex items-center p-2
                    ${isOpen ? 'flex-row justify-between' : 'flex-col gap-2'}
                `}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-full">
                            <UserButton />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {session?.user && (
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>{session.user.name}</DropdownMenuItem>
                            <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>
                                Sign out <LogOutIcon className="ml-auto size-4" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
                <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
    );
}
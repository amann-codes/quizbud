'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserButton } from './userbutton'
import { motion } from 'framer-motion'
import { Sparkles, LayoutGrid, History, Trophy, Clipboard } from 'lucide-react'

const navItems = [
    { label: 'Generate', href: '/generate', icon: Sparkles },
    { label: 'Quizzes', href: '/quiz', icon: LayoutGrid },
    { label: 'History', href: '/test', icon: History },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
]

export function Header() {
    const pathname = usePathname()

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">

                    {(pathname == "/generate") ?
                        <div className='flex flex-row gap-2'>
                            <Clipboard className='text-white' />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                QuizBud
                            </span>
                        </div>
                        :
                        <Link href="/generate" className="flex items-center gap-2 group">
                            <Clipboard className='text-white' />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                                QuizBud
                            </span>
                        </Link>

                    }
                    <nav className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'relative px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                                        isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-nav-pill"
                                            className="absolute inset-0 z-0 rounded-full bg-zinc-800"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <UserButton />
                    </div>
                </div>
            </header>

            <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 sm:hidden">
                <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-lg shadow-2xl shadow-black/50">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 rounded-xl transition-all duration-300',
                                    isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-pill"
                                        className="absolute inset-0 z-0 rounded-xl bg-white/10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex flex-col items-center gap-0.5">
                                    <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            <div className="h-20" />
        </>
    )
}
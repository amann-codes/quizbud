'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserButton } from './userbutton'

const navItems = [
    { label: 'Generate Quiz', href: '/' },
    { label: 'Your quizzes', href: '/quiz' },
    { label: 'Test history', href: '/test' },
]

export function Header() {
    const pathname = usePathname()

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
                <Link href="/" className="flex items-center">
                    <span className="font-bold text-lg sm:text-xl">QuizBud</span>
                </Link>
                <div className="hidden sm:flex items-center space-x-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'px-4 py-3 text-sm font-medium transition-colors',
                                pathname === item.href
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center">
                    <UserButton />
                </div>
            </header>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background sm:hidden">
                <div className="flex justify-around py-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                                pathname === item.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <span>{item.label.split(' ')[0]}</span>
                            {pathname === item.href && (
                                <div className="h-0.5 w-8 rounded-full bg-primary" />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="h-14" />
        </>
    )
}
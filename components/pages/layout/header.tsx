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
        <header className="h-12 flex justify-between items-center border-b border-border bg-background mx-5">
            <div className='flex justify-between items-center gap-3'>
                <Link href={"/"}>
                    <span className='font-bold text-xl'>QuizBud</span>
                </Link>
                <nav className="flex items-center px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1">
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
                </nav>
            </div>
            <UserButton />
        </header>
    )
}

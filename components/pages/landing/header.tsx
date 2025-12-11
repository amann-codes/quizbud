import { Button } from "@/components/ui/button"
import { Clipboard } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-slide-down glass-effect">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/60 group-hover:rotate-12 transition-all duration-500">
              <Clipboard className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-black">
              QuizBud
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#Features"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 ease-out" />
            </a>
            <a
              href="#How it works"
            >
              How It Works
              <span
              />
            </a>
            <a
              href="#Leaderboard"
            >
              Leaderboard
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/auth">
              <Button
                size="sm"
                className="text-white cursor-pointer font-semibold transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
              </Button>
            </a>
          </div>
        </div>
      </nav>
    </header >
  )
}
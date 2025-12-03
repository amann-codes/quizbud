"use client"

import { FileText, Play, TrendingUp } from "lucide-react"
import { WobbleCard } from "@/components/ui/wobble-card"

const steps = [
  {
    icon: FileText,
    title: "Create or Access",
    description: "Build custom quizzes or join existing ones",
    number: "01",
    accent: "cyan",
  },
  {
    icon: Play,
    title: "Take the Test",
    description: "Answer with real-time tracking and feedback",
    number: "02",
    accent: "amber",
  },
  {
    icon: TrendingUp,
    title: "Get Analytics",
    description: "Receive insights and watch rankings update",
    number: "03",
    accent: "emerald",
  },
]

export default function HowItWorks() {
  return (
    <section id="How it works" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse`} />
        <div className={`absolute top-1/2 -translate-y-1/2 -right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] animate-pulse delay-1000`} />
        <div className={`absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-2000`} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center space-y-4">
          {/* Only change: shining gradient title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to master quizzes and track progress
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <WobbleCard
                key={step.title}
                className={`group relative overflow-hidden border border-border/50 bg-card/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl shadow-${step.accent}-500/20`}
              >
                <div className="relative z-10 p-8 text-center space-y-6">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 bg-background/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                    <Icon className={`h-10 w-10 text-${step.accent}-500 transition-transform duration-300 group-hover:scale-125`} />
                  </div>

                  <div className={`inline-block px-5 py-2 rounded-full bg-${step.accent}-500/10 border border-${step.accent}-500/20`}>
                    <span className={`text-sm font-bold uppercase tracking-wider text-${step.accent}-500`}>
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-bold text-foreground transition-colors duration-400 group-hover:text-${step.accent}-500`}>
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-${step.accent}-500/10 pointer-events-none`} />
              </WobbleCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
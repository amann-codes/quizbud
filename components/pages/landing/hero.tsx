"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HeroHighlight } from "@/components/ui/hero-highlight"

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20">
      <BackgroundBeams className="absolute inset-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-8 animate-slide-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Meet Your Quiz Companion</span>
              </div>

              <HeroHighlight>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-tight">
                  Master quizzes with real-time analytics
                </h1>
                <p className="text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-lg">
                  Create custom quizzes, practice with intelligent tracking, and transform your performance through
                  detailed insights. Track progress and compete globally.
                </p>
              </HeroHighlight>
            </div>


          </div>

          <div className="relative h-[500px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <a href="/auth">
              <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-12">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
                >
                  <span className="relative cursor-pointer z-10 flex items-center gap-2">
                    Start Practicing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-accent/50 hover:bg-accent/10 hover:border-accent text-foreground transition-all duration-300 transform hover:scale-105 relative group bg-transparent"
                >
                  <span className="relative z-10 cursor-pointer">Create Quiz</span>
                </Button>
              </div>
            </a>
            <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card/80 to-card/40 overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300 h-full backdrop-blur-xl">
              <div className="p-6 h-full flex flex-col relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="font-semibold text-foreground text-lg">User Statistics</h3>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-green-400">Live</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6 py-6">
                  {[
                    { label: "Correct", value: "67%", progress: 0.67 },
                    { label: "Incorrect", value: "12%", progress: 0.12 },
                    { label: "Skipped", value: "21%", progress: 0.21 },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="space-y-2 group/metric hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-foreground/80">{metric.label}</p>
                        <span className="text-sm font-bold text-primary">{metric.value}</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden backdrop-blur">
                        <div
                          className="h-full rounded-full bg-primary group-hover/metric:bg-accent transition-all duration-300"
                          style={{ width: `${metric.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-12 mx-auto pt-8 border-t border-border">
                  {[
                    { label: "Active Users", value: "13+" },
                    { label: "Quizzes Created", value: "50+" },
                    { label: "Total Attempts", value: "60" },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="space-y-1 group animate-slide-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:text-accent transition-colors">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

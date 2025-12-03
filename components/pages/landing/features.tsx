"use client"

import { Zap, BarChart3, Trophy } from "lucide-react"
import { CardSpotlight } from "@/components/ui/card-spotlight"

const features = [
  {
    icon: Zap,
    title: "Smart Quiz Engine",
    description: "Custom quizzes with time-limits, progressive navigation, and intelligent sequencing.",
    color: "bg-yellow-500/10 border-yellow-500/30",
    iconColor: "text-yellow-500",
    cardColor: "bg-gradient-to-b from-yellow-950 via-yellow-900/20 to-transparent"
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "Accuracy metrics, speed analysis, topic breakdowns, and detailed tracking.",
    color: "bg-blue-500/10 border-blue-500/30",
    iconColor: "text-blue-500",
    cardColor: "bg-gradient-to-b from-blue-950 via-blue-900/20 to-transparent"
  },
  {
    icon: Trophy,
    title: "Adaptive Leaderboard",
    description: "Real-time scoring, ranking, previous rank tracking, and improvement metrics.",
    color: "bg-emerald-500/10 border-emerald-500/30",
    iconColor: "text-emerald-500",
    cardColor: "bg-gradient-to-b from-emerald-950 via-emerald-900/20 to-transparent"
  },
]

export default function Features() {
  return (
    <section id="Features" className="py-20 sm:py-32 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center space-y-4">
          {/* Shining gradient title – only change */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-yellow-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master competitive quizzes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <CardSpotlight key={feature.title} className={`group ${feature.cardColor}`}>
                <div
                  className={`relative border p-8 h-full bg-white/50 backdrop-blur-2xl rounded-2xl shadow-xl transition-all duration-300 ${feature.color}`}
                >
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-white border border-current/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-current/10 group-hover:border-current/30 transition-colors">
                    <div className="h-1 rounded-full bg-current w-0 group-hover:w-12 transition-all duration-1000" />
                  </div>
                </div>
              </CardSpotlight>
            )
          })}
        </div>
      </div>
    </section>
  )
}
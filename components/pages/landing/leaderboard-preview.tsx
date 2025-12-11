"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

const leaderboardData = [
  { rank: 1, prevRank: 2, name: "Alex Chen", score: 9850, improvement: "+215" },
  { rank: 2, prevRank: 1, name: "Jordan Smith", score: 9720, improvement: "-130" },
  { rank: 3, prevRank: 4, name: "Morgan Lee", score: 9645, improvement: "+340" },
  { rank: 4, prevRank: 3, name: "Casey White", score: 9520, improvement: "-125" },
  { rank: 5, prevRank: 6, name: "Taylor Davis", score: 9410, improvement: "+205" },
]

export default function LeaderboardPreview() {
  return (
    <section id="Leaderboard" className="py-20 sm:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-emerald-500 to-yellow-500 bg-clip-text text-transparent">
            Live Leaderboard
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Real-time rankings • Instant updates • Global competition</p>
        </div>


        <div className="rounded-2xl border-2 border-gradient-to-r from-primary/30 via-primary/10 to-secondary/30 bg-gradient-to-br from-card/50 to-card/30 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group animate-slide-up glass-effect">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 group-hover:from-primary/15 group-hover:via-secondary/15 group-hover:to-accent/15 transition-colors">
                  <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-black">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-black">
                    Name
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-black">
                    Score
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-black">Change</th>
                  <th className="px-6 py-4 text-right text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-black">
                    Improvement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboardData.map((entry, idx) => (
                  <tr
                    key={entry.rank}
                    className="hover:bg-gradient-to-r hover:from-primary/5 hover:via-secondary/5 hover:to-accent/5 transition-all duration-300 group/row animate-slide-up border-b border-white/5"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover/row:drop-shadow-lg transition-all">
                        #{entry.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground group-hover/row:text-primary transition-colors">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 text-right font-bold bg-gradient-to-r from-primary to-accent bg-clip-text group-hover/row:from-secondary group-hover/row:to-primary transition-all text-black">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold backdrop-blur transition-all duration-300 group-hover/row:scale-110 ${entry.rank < entry.prevRank
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-orange-500/20 text-orange-400"
                          }`}
                      >
                        {entry.rank < entry.prevRank ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        #{Math.abs(entry.rank - entry.prevRank)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-black group-hover/row:from-accent group-hover/row:to-secondary transition-all">
                      {entry.improvement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px currentColor);
        }
      `}</style>
    </section>
  )
}
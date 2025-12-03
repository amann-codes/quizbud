import Header from "@/components/pages/landing/header"
import Hero from "@/components/pages/landing/hero"
import Features from "@/components/pages/landing/features"
import HowItWorks from "@/components/pages/landing/how-it-works"
import LeaderboardPreview from "@/components/pages/landing/leaderboard-preview"
import Footer from "@/components/pages/landing/footer"

export const metadata = {
  title: "QuizBud - Master Competitive Quizzes with Real-time Analytics",
  description:
    "Create custom quizzes, practice with smart tracking, and improve through detailed insights. Master competitive quizzes with real-time analytics.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <LeaderboardPreview />
      <Footer />
    </main>
  )
}

"use client"

import { Clipboard, Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Links",
      gradient: "from-primary to-secondary",
      items: [
        { name: "Features", href: "#Features" },
        { name: "How it works", href: "#How it works" },
        { name: "Leaderboard", href: "#Leaderboard" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/amanncodes", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/aman-prajapati-540a53277/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/amann-codes", label: "GitHub" },
  ]

  return (
    <footer className="border-t border-border/50 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-96 left-1/3 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse-scale" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12 pb-12 border-b border-border/50">
          <div className="space-y-6 group animate-slide-up">
            <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/60 group-hover:rotate-12 transition-all duration-500">
                <Clipboard className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground">QuizBud</span>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Master competitive quizzes with real-time analytics and intelligent performance tracking.
            </p>

            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/20 border border-border/50 hover:border-primary/30 transition-all duration-400 group/icon transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                >
                  <Icon className="h-5 w-5 text-muted-foreground group-hover/icon:text-primary group-hover/icon:rotate-12 transition-all duration-400" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, idx) => (
            <div
              key={section.title}
              className="space-y-5 animate-slide-up"
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <h3 className={`font-bold text-lg bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map(({ name, href }) => (
                  <li key={name}>
                    <a
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 group/link transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 scale-0 group-hover/link:scale-100 transition-transform duration-300" />
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} QuizBud. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
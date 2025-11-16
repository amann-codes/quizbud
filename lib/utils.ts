import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const initials = parts.map(p => p.charAt(0).toUpperCase());
  return initials.join('');
}

export function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function toHMS(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return { h, m, s }
}

export function getUUID() {
  return crypto.randomUUID();
}

export function TimeLeft(time: Date): { diff: number, hours: number; minutes: number; seconds: number } {
  const diff = Date.now() - time.getTime();
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  return { diff, hours, minutes, seconds };
}

export const getPerformanceMessage = (percentage: number,) => {
  const messages = {
    excellent: [
      { text: "Outstanding! You're a quiz master!", color: "text-emerald-600" },
      { text: "Perfect performance! Absolutely brilliant!", color: "text-emerald-600" },
      { text: "Exceptional work! You've nailed it!", color: "text-emerald-600" },
      { text: "Phenomenal! You're on fire!", color: "text-emerald-600" },
      { text: "Incredible! Top-tier performance!", color: "text-emerald-600" },
      { text: "Masterful! You've crushed it!", color: "text-emerald-600" },
      { text: "Flawless execution! Amazing work!", color: "text-emerald-600" },
      { text: "Spectacular! You're a star!", color: "text-emerald-600" },
    ],
    great: [
      { text: "Great job! Impressive work!", color: "text-emerald-600" },
      { text: "Excellent! You really know your stuff!", color: "text-emerald-600" },
      { text: "Fantastic! Keep up the great work!", color: "text-emerald-600" },
      { text: "Well done! Strong performance!", color: "text-emerald-600" },
      { text: "Superb! You're doing amazing!", color: "text-emerald-600" },
      { text: "Brilliant! Very impressive!", color: "text-emerald-600" },
      { text: "Outstanding effort! Keep it up!", color: "text-emerald-600" },
      { text: "Terrific! You've got this!", color: "text-emerald-600" },
    ],
    good: [
      { text: "Good job! You're getting there!", color: "text-blue-600" },
      { text: "Nice work! Solid effort!", color: "text-blue-600" },
      { text: "Well done! Keep improving!", color: "text-blue-600" },
      { text: "Good effort! You're on the right track!", color: "text-blue-600" },
      { text: "Decent performance! Keep going!", color: "text-blue-600" },
      { text: "Not bad! Room to grow!", color: "text-blue-600" },
      { text: "Fair result! Practice makes perfect!", color: "text-blue-600" },
      { text: "Respectable! Keep pushing forward!", color: "text-blue-600" },
    ],
    needsWork: [
      { text: "Keep practicing! You'll get better!", color: "text-amber-600" },
      { text: "Don't give up! Improvement ahead!", color: "text-amber-600" },
      { text: "Good start! More practice needed!", color: "text-amber-600" },
      { text: "Keep trying! You can do this!", color: "text-amber-600" },
      { text: "Stay positive! Growth takes time!", color: "text-amber-600" },
      { text: "Don't quit! Progress is coming!", color: "text-amber-600" },
      { text: "Keep going! Every attempt counts!", color: "text-amber-600" },
      { text: "Practice more! You've got potential!", color: "text-amber-600" },
    ],
    retry: [
      { text: "Review and try again! You've got this!", color: "text-orange-600" },
      { text: "Time to study! Come back stronger!", color: "text-orange-600" },
      { text: "Don't worry! Learn and retry!", color: "text-orange-600" },
      { text: "Review the material! You can improve!", color: "text-orange-600" },
      { text: "Take your time! Study and return!", color: "text-orange-600" },
      { text: "No worries! Practice makes perfect!", color: "text-orange-600" },
      { text: "Brush up and try again soon!", color: "text-orange-600" },
      { text: "Learn from mistakes! Next time will be better!", color: "text-orange-600" },
    ]
  }

  let categoryMessages
  if (percentage >= 90) categoryMessages = messages.excellent
  else if (percentage >= 75) categoryMessages = messages.great
  else if (percentage >= 60) categoryMessages = messages.good
  else if (percentage >= 50) categoryMessages = messages.needsWork
  else categoryMessages = messages.retry

  const randomIndex = Math.floor(Math.random() * categoryMessages.length)
  return categoryMessages[randomIndex]
}
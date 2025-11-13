import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { uuid } from "zod";

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
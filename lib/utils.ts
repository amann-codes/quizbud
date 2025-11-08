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
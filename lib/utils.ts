import { type ClassValue, clsx } from "clsx"
import { differenceInDays } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDaysAgo = (createdAt: Date) =>
  differenceInDays(new Date(), createdAt)

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M"
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K"
  } else {
    return number.toString()
  }
}

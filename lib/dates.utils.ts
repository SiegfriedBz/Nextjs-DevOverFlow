import { differenceInDays, format } from "date-fns"

export const getDaysAgo = (createdAt: Date) => {
  return differenceInDays(new Date(), createdAt)
}

export const formatDate = (date: Date) => {
  return format(date, "MMMM dd, yyyy, hh:mm a")
}

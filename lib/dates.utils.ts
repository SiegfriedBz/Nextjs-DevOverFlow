import { differenceInDays } from "date-fns"

export const getDaysAgo = (createdAt: Date) => {
  return differenceInDays(new Date(), createdAt)
}

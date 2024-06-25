import { differenceInDays } from "date-fns"

export const getDaysAgo = (createdAt: Date) =>
  differenceInDays(new Date(), createdAt)

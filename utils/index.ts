import { BADGE_CRITERIA } from "@/constants"
import type { TBadgeCounts } from "@/types"

export type TBadgeCriteria = {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}

export const assignBadges = (params: TBadgeCriteria) => {
  const badgeCounts: TBadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  }

  const { criteria } = params

  criteria.forEach((item) => {
    const { type, count } = item
    const badgeLevels: any = BADGE_CRITERIA[type]

    Object.keys(badgeLevels).forEach((key: any) => {
      if (count > badgeLevels[key]) {
        badgeCounts[key as keyof TBadgeCounts] += 1
      }
    })
  })

  return badgeCounts
}

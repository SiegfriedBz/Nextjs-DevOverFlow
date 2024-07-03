import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import React from "react"

type TProps = {
  totalQuestions: number
  totalAnswers: number
}
const UserStats = ({ totalQuestions, totalAnswers }: TProps) => {
  return (
    <div className="mt-10">
      <h3 className="h3-semibold text-dark200_light900">Stats</h3>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="flex items-center gap-2">
            <p className="paragraph-semibold text-dark200_light900">
              {totalQuestions ? formatNumber(totalQuestions) : 0}
            </p>
            <p className="body-medium text-dark400_light700">{`Question${totalQuestions > 1 ? "s" : ""}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="paragraph-semibold text-dark200_light900">
              {totalAnswers ? formatNumber(totalAnswers) : 0}
            </p>
            <p className="body-medium text-dark400_light700">{`Answer${totalAnswers > 1 ? "s" : ""}`}</p>
          </div>
        </div>
        <StatCard iconName="gold-medal" value={144} label="Gold Badge" />
        <StatCard iconName="silver-medal" value={144} label="Silver Badge" />
        <StatCard iconName="bronze-medal" value={0} label="Bronze Badge" />
      </div>
    </div>
  )
}

export default UserStats

type TStatCardProps = {
  iconName: string
  value: number
  label: string
}
const StatCard = ({ iconName, value, label }: TStatCardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-center gap-4 rounded-xl border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image
        src={`/assets/icons/${iconName}.svg`}
        alt="icon"
        width={40}
        height={50}
      />

      <div>
        <p className="paragraph-semibold text-dark200_light900 text-center">
          {value ? formatNumber(value) : 0}
        </p>
        <p className="body-medium text-dark400_light700 whitespace-nowrap">{`${label}${value > 1 ? "s" : ""}`}</p>
      </div>
    </div>
  )
}

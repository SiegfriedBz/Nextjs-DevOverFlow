import type { TTag } from "@/types"
import React from "react"
import TagCard from "./TagCard"

type TProps = {
  data: TTag[] | null
  children: React.ReactNode
}

const TagList = ({ data, children }: TProps) => {
  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-wrap justify-center gap-8 sm:justify-start">
      {data.map((tag) => {
        return (
          <li key={tag._id} className="h-full">
            <TagCard {...tag} />
          </li>
        )
      })}
    </ul>
  ) : (
    // NoResult
    <>{children}</>
  )
}

export default TagList

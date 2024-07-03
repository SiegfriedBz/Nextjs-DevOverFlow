import type { TQuestion } from "@/types"
import QuestionCard from "./QuestionCard"
import React from "react"

const QuestionList = ({
  currentUserClerkId,
  data,
  children,
}: {
  currentUserClerkId?: string
  data: TQuestion[] | null
  children: React.ReactNode
}) => {
  return data && data?.length > 0 ? (
    <ul className="mb-4 flex flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {data.map((question) => {
        return (
          <li key={question._id} className="w-full">
            <QuestionCard
              {...question}
              currentUserClerkId={currentUserClerkId}
            />
          </li>
        )
      })}
    </ul>
  ) : (
    // noResult
    <>{children}</>
  )
}

export default QuestionList

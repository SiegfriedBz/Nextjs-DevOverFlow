import ShortAnswerCard from "@/components/answers/ShortAnswerCard"
import type { IAnswerDocument } from "@/models/answer.model"
import type { TQuestion, TUser } from "@/types"
import React from "react"

const ShortAnswerList = ({
  currentUserClerkId,
  data,
  children,
}: {
  currentUserClerkId?: string
  data: IAnswerDocument[] | null
  children: React.ReactNode
}) => {
  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {data.map((answer) => {
        const answerId = answer?._id
        const answerContent = answer?.content
        const answerCreatedAt = answer?.createdAt
        const answerUpVoters = answer?.upVoters
        const answerAuthor = answer?.author
        const question = answer?.question

        if (!question) return null

        const { _id: questionId, title: questionTitle } =
          question as unknown as TQuestion

        return (
          <li key={answerId as string}>
            <ShortAnswerCard
              currentUserClerkId={currentUserClerkId}
              answerId={answerId as string}
              answerContent={answerContent as string}
              answerAuthor={answerAuthor as unknown as TUser}
              answerUpVoters={answerUpVoters as unknown as string[]}
              answerCreatedAt={answerCreatedAt as Date}
              questionId={questionId as string}
              questionTitle={questionTitle}
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

export default ShortAnswerList

import AnswerCard from "@/components/answers/AnswerCard"
import { formatDate } from "@/lib/dates.utils"
import type { TAnswer, TUser } from "@/types"
import React from "react"

type TProps = {
  currentUserMongoId: string
  data: TAnswer[] | null
  children: React.ReactNode
}
const AnswerList = ({ currentUserMongoId, data, children }: TProps) => {
  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-col gap-8 pb-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {data?.map((answer) => {
        const {
          author, // populated user string[]
          content,
          upVoters, // non-populated user string[]
          downVoters, // non-populated user string[]
          createdAt,
        } = answer

        const answerNumUpVotes = upVoters?.length ?? 0
        const answerNumDownVotes = downVoters?.length ?? 0
        const userHasUpVotedAnswer = upVoters.some(
          (voterId) => voterId === currentUserMongoId
        )
        const userHasDownVotedAnswer = downVoters.some(
          (voterId) => voterId === currentUserMongoId
        )

        return (
          <AnswerCard
            key={`answer-${answer._id}`}
            currentUserMongoId={currentUserMongoId}
            currentUserHasUpVoted={userHasUpVotedAnswer}
            currentUserHasDownVoted={userHasDownVotedAnswer}
            answerId={answer._id}
            answerAuthor={author as unknown as TUser}
            answerContent={content}
            answeredOn={`answered ${formatDate(createdAt)}`}
            answerNumUpVotes={answerNumUpVotes}
            answerNumDownVotes={answerNumDownVotes}
          />
        )
      })}
    </ul>
  ) : (
    // No Result
    <>{children}</>
  )
}

export default AnswerList

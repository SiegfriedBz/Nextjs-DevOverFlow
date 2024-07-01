import type { TUser } from "@/types"
import React from "react"
import DetailsQuestionOrAnswerAuthor from "./DetailsQuestionOrAnswerAuthor"
import Voting from "./Voting"

type TProps = {
  currentUserMongoId: string
  currentUserHasUpVoted: boolean
  currentUserHasDownVoted: boolean
  author: TUser // of question | answer
  numUpVotes: number // of question | answer
  numDownVotes: number // of question | answer
  children?: React.ReactNode
} & (
  | {
      // question case
      questionId: string
      answerId?: undefined
      answeredOn?: undefined
    }
  | {
      // answer case
      questionId?: undefined
      answerId: string
      answeredOn: string
    }
)

const DetailsQuestionOrAnswerHeader = ({
  currentUserMongoId,
  currentUserHasUpVoted,
  currentUserHasDownVoted,
  author, // of question | answer
  numUpVotes, // of question | answer
  numDownVotes, // of question | answer
  children,
  // question case
  questionId,
  // answer case
  answerId,
  answeredOn,
}: TProps) => {
  return (
    <>
      {/* Author */}
      <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <DetailsQuestionOrAnswerAuthor
          author={author as TUser}
          answeredOn={answeredOn}
        />

        {/* Client-Component */}
        <Voting
          className="flex w-full items-center justify-end gap-4"
          currentUserMongoId={currentUserMongoId}
          currentUserHasUpVoted={currentUserHasUpVoted}
          currentUserHasDownVoted={currentUserHasDownVoted}
          numUpVotes={numUpVotes} // of question | answer
          numDownVotes={numDownVotes} // of question | answer
          // question case
          questionId={questionId}
          // answer case
          answerId={answerId}
        >
          {children}
        </Voting>
      </div>
    </>
  )
}

export default DetailsQuestionOrAnswerHeader

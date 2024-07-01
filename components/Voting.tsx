"use client"

import React, { useEffect } from "react"
import Metric from "./Metric"
import { voteQuestionAction } from "@/server-actions/question.actions"
import { voteAnswerAction } from "@/server-actions/answer.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createViewForAction } from "@/server-actions/interaction.actions"

type TVotingProps = {
  children?: React.ReactNode
  className?: string
  currentUserMongoId: string
  numUpVotes: number
  numDownVotes: number
  currentUserHasUpVoted: boolean
  currentUserHasDownVoted: boolean
  // question case
  questionId?: string
  // answer case
  answerId?: string
}

/** Voting component to
 *  1. Handle vote on
 *  - Question
 *  - Answer
 *  2. Create (if not exists) a new view interaction record on component mount
 */
const Voting = ({
  children,
  className = "",
  currentUserMongoId,
  numUpVotes,
  numDownVotes,
  currentUserHasUpVoted,
  currentUserHasDownVoted,
  // question case
  questionId,
  // answer case
  answerId,
}: TVotingProps) => {
  const router = useRouter()
  const isQuestionVoting = questionId != null

  // create (if not exists) a new view interaction record on component mount
  useEffect(() => {
    ;(async () => {
      isQuestionVoting
        ? await createViewForAction({
            viewFor: "question",
            questionId: questionId as string,
          })
        : await createViewForAction({
            viewFor: "answer",
            answerId: answerId as string,
          })
    })()
  }, [isQuestionVoting, questionId, answerId])

  const handleVote = async ({ isUpVoting }: { isUpVoting: boolean }) => {
    if (!currentUserMongoId) {
      router.push("/sign-in")
      router.refresh()
      toast.info(`Please sign-in to vote`)
      return
    }

    try {
      const response = isQuestionVoting
        ? await voteQuestionAction({
            questionId: questionId as string,
            voterId: currentUserMongoId,
            isUpVoting,
          })
        : await voteAnswerAction({
            answerId: answerId as string,
            voterId: currentUserMongoId,
            isUpVoting,
          })

      if (response instanceof Error) {
        throw new Error(response.message)
      }
      toast.success(
        `${isUpVoting ? "Up" : "Down"} voted ${isQuestionVoting ? "question" : "answer"} successfully!`
      )
    } catch (error) {
      console.log(`handle${isUpVoting ? "Up" : "Down"}-Vote ERROR`, error)
      toast.error(
        `Could not ${isUpVoting ? "up" : "down"}vote ${isQuestionVoting ? "question" : "answer"}`
      )
    }
  }

  return (
    <div className={className}>
      <button onClick={() => handleVote({ isUpVoting: true })}>
        <Metric
          imageSrc={`/assets/icons/${currentUserHasUpVoted ? "upvoted" : "upvote"}.svg`}
          alt="up-votes"
          value={numUpVotes}
          className="cursor-pointer"
          paragraphClassName="background-light700_dark400 p-1 min-w-[18px]"
        />
      </button>

      <button onClick={() => handleVote({ isUpVoting: false })}>
        <Metric
          imageSrc={`/assets/icons/${currentUserHasDownVoted ? "downvoted" : "downvote"}.svg`}
          alt="down-votes"
          value={numDownVotes}
          className="cursor-pointer"
          paragraphClassName="background-light700_dark400 p-1 min-w-[18px]"
        />
      </button>
      {children}
    </div>
  )
}

export default Voting

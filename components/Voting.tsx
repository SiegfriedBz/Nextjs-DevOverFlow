"use client"

import React from "react"
import Metric from "./shared/Metric"
import { voteQuestionAction } from "@/server-actions/question.actions"
import { voteAnswerAction } from "@/server-actions/answer.actions"
import { toast } from "sonner"

type TVotingProps = {
  currentUserMongoId: string
  numUpVotes: number
  numDownVotes: number
  isQuestionVoting: boolean
  questionId?: string
  answerId?: string
  className?: string
  children?: React.ReactNode
}

const Voting = ({
  currentUserMongoId,
  numUpVotes,
  numDownVotes,
  isQuestionVoting,
  questionId,
  answerId,
  className = "",
  children,
}: TVotingProps) => {
  const handleUpVote = async () => {
    try {
      const response = isQuestionVoting
        ? await voteQuestionAction({
            questionId: questionId as string,
            voterId: currentUserMongoId,
            isUpVoting: true,
          })
        : await voteAnswerAction({
            answerId: answerId as string,
            voterId: currentUserMongoId,
            isUpVoting: true,
          })

      if (response instanceof Error) {
        throw new Error(response.message)
      }
      toast.success(
        `Upvoted the ${isQuestionVoting ? "question" : "answer"} successfully!`
      )
    } catch (error) {
      console.log("handleUpVote ERROR", error)
      toast.warning(
        `Could not upvote the ${isQuestionVoting ? "question" : "answer"}`
      )
    }
  }
  const handleDownVote = async () => {
    try {
      const response = isQuestionVoting
        ? await voteQuestionAction({
            questionId: questionId as string,
            voterId: currentUserMongoId,
            isUpVoting: false,
          })
        : await voteAnswerAction({
            answerId: answerId as string,
            voterId: currentUserMongoId,
            isUpVoting: false,
          })

      if (response instanceof Error) {
        throw new Error(response.message)
      }
      toast.success(
        `Downvoted the ${isQuestionVoting ? "question" : "answer"} successfully!`
      )
    } catch (error) {
      console.log("handleUpVote ERROR", error)
      toast.warning(
        `Could not downvote the ${isQuestionVoting ? "question" : "answer"}`
      )
    }
  }

  return (
    <div className={className}>
      <button onClick={handleUpVote}>
        <Metric
          imageSrc="/assets/icons/upvote.svg"
          alt="up-votes"
          value={numUpVotes}
          className="cursor-pointer"
        />
      </button>

      <button onClick={handleDownVote}>
        <Metric
          imageSrc="/assets/icons/downvote.svg"
          alt="down-votes"
          value={numDownVotes}
          className="cursor-pointer"
        />
      </button>
      {children}
    </div>
  )
}

export default Voting

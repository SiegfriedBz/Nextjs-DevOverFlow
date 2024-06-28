import React from "react"
import Metric from "./shared/Metric"

type TVotingProps = {
  numUpVotes: number
  numDownVotes: number
  className?: string
  children?: React.ReactNode
}

const Voting = ({
  numUpVotes,
  numDownVotes,
  className = "",
  children,
}: TVotingProps) => {
  return (
    <div className={className}>
      {/* Voting */}
      {/* TODO WRAP AROUND A CLIENT COMPONENT WITH ON CLICK */}
      <Metric
        imageSrc="/assets/icons/upvote.svg"
        alt="up-votes"
        value={numUpVotes}
        className="cursor-pointer"
      />
      {/* TODO WRAP AROUND A CLIENT COMPONENT WITH ON CLICK */}
      <Metric
        imageSrc="/assets/icons/downvote.svg"
        alt="down-votes"
        value={numDownVotes}
        className="cursor-pointer"
      />
      {children}
    </div>
  )
}

export default Voting

import DetailsQuestionOrAnswerHeader from "@/components/DetailsQuestionOrAnswerHeader"
import type { TUser } from "@/types"
import dynamic from "next/dynamic"

// fix hydration error
const ParsedHtml = dynamic(() => import("@/components/shared/ParsedHtml"), {
  ssr: false,
})

type TProps = {
  currentUserMongoId: string
  currentUserHasUpVoted: boolean
  currentUserHasDownVoted: boolean
  answerId: string
  answerAuthor: TUser
  answerContent: string
  answeredOn: string
  answerNumUpVotes: number
  answerNumDownVotes: number
}

const AnswerCard = ({
  currentUserMongoId,
  currentUserHasUpVoted,
  currentUserHasDownVoted,
  answerId,
  answerAuthor,
  answerContent,
  answeredOn,
  answerNumUpVotes,
  answerNumDownVotes,
}: TProps) => {
  return (
    <>
      {/* Author's Answer + votes */}
      <DetailsQuestionOrAnswerHeader
        currentUserMongoId={currentUserMongoId}
        currentUserHasUpVoted={currentUserHasUpVoted}
        currentUserHasDownVoted={currentUserHasDownVoted}
        answerId={answerId}
        author={answerAuthor}
        answeredOn={answeredOn}
        numUpVotes={answerNumUpVotes}
        numDownVotes={answerNumDownVotes}
      />
      {/* Answer's Content */}
      <ParsedHtml data={answerContent} />
    </>
  )
}

export default AnswerCard

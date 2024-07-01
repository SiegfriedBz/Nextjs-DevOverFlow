import EditDeleteActionButton from "@/components/EditDeleteActionButton"
import Metric from "@/components/Metric"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDaysAgo } from "@/lib/dates.utils"
import type { TUser } from "@/types"
import dynamic from "next/dynamic"
import Link from "next/link"

// fix hydration error
const ParsedHtml = dynamic(() => import("@/components/shared/ParsedHtml"), {
  ssr: false,
})

type TProps = {
  currentUserClerkId?: string
  answerId: string
  answerContent: string
  answerAuthor: TUser
  answerUpVoters: string[]
  answerCreatedAt: Date
  questionId: string
  questionTitle: string
}
const ShortAnswerCard = ({
  currentUserClerkId,
  answerId,
  answerContent,
  answerAuthor,
  answerUpVoters,
  answerCreatedAt,
  questionId,
  questionTitle,
}: TProps) => {
  const isAnswerAuthor = currentUserClerkId === answerAuthor.clerkId
  const numUpVotes = answerUpVoters?.length
  const daysAgo = getDaysAgo(answerCreatedAt)

  return (
    <Card
      className="background-light800_darkgradient 
        text-dark400_light700   
        w-full
        rounded-xl
        border-none
        px-4 py-2
        shadow-none
        outline-none
        sm:px-10
      "
    >
      <CardHeader>
        <span className="mb-2 text-xs opacity-80 sm:hidden">
          {daysAgo === 0
            ? "Today"
            : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}
        </span>

        <div className="flex items-center justify-between">
          <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
            <Link href={`/questions/${questionId}`}>{questionTitle}</Link>
          </CardTitle>

          {/* Signed-in Delete Answer Btn */}
          {isAnswerAuthor && (
            // Client-Component
            <EditDeleteActionButton
              actionType="mutateAnswer"
              answerId={JSON.parse(JSON.stringify(answerId))}
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Answer's short Content */}
        <ParsedHtml data={answerContent} />
      </CardContent>
      <CardFooter>
        <div
          className="flex w-full items-center justify-between text-sm 
          max-2xl:flex-col max-2xl:items-start max-2xl:gap-4"
        >
          <Metric
            imageSrc={answerAuthor?.picture || "/assets/icons/avatar.svg"}
            alt="avatar"
            className="body-medium text-dark400_light800"
            href={`/profile/${answerAuthor?.clerkId}`}
            isAuthor={isAnswerAuthor}
            value={answerAuthor?.name}
            title={` - asked ${
              daysAgo === 0
                ? "Today"
                : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`
            }`}
          />
          <div className="flex items-center gap-x-2">
            <Metric
              imageSrc="/assets/icons/like.svg"
              alt="numOfVotes"
              value={numUpVotes}
              title={` Vote${numUpVotes > 1 ? "s" : ""}`}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ShortAnswerCard

import EditDeleteActionButton from "@/components/EditDeleteActionButton"
import Metric from "@/components/Metric"
import Tag from "@/components/Tag"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDaysAgo } from "@/lib/dates.utils"
import type { IUserDocument } from "@/models/user.model"
import type { TQuestion, TTag, TUser } from "@/types"
import Link from "next/link"

type TProps = TQuestion & { currentUserClerkId?: string }
const QuestionCard = ({
  currentUserClerkId,
  _id: questionId,
  title,
  views,
  author,
  upVoters,
  downVoters,
  tags,
  answers,
  createdAt,
}: TProps) => {
  const isQuestionAuthor =
    currentUserClerkId === (author as unknown as TUser).clerkId
  const numOfVotes = upVoters?.length + downVoters?.length ?? 0
  const numOfAnswers = answers?.length ?? 0
  const daysAgo = getDaysAgo(createdAt)

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
            <Link href={`/questions/${questionId}`}>{title}</Link>
          </CardTitle>

          {/* Signed-in Update & Delete Question Btn */}
          {isQuestionAuthor && (
            // Client-Component
            <EditDeleteActionButton
              actionType="mutateQuestion"
              questionId={JSON.parse(JSON.stringify(questionId))}
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {(tags as unknown as TTag[])?.map((tag) => {
            return <Tag key={`q-${title}-${tag._id}`} {...tag} />
          })}
        </ul>
      </CardContent>
      <CardFooter>
        <div
          className="flex w-full items-center justify-between text-sm 
          max-2xl:flex-col max-2xl:items-start max-2xl:gap-4"
        >
          <Metric
            imageSrc={
              (author as IUserDocument)?.picture || "/assets/icons/avatar.svg"
            }
            alt="avatar"
            className="body-medium text-dark400_light800"
            href={`/profile/${(author as IUserDocument)?.clerkId}`}
            isAuthor={isQuestionAuthor}
            value={(author as IUserDocument)?.name}
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
              value={numOfVotes}
              title={` Vote${numOfVotes > 1 ? "s" : ""}`}
            />
            <Metric
              imageSrc="/assets/icons/message.svg"
              alt="numOfAnswers"
              value={numOfAnswers}
              title={` Answer${numOfAnswers > 1 ? "s" : ""}`}
            />
            <Metric
              imageSrc="/assets/icons/eye.svg"
              alt="numOfViews"
              value={views}
              title={` View${views > 1 ? "s" : ""}`}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default QuestionCard

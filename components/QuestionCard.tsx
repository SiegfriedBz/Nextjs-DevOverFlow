import Metric from "@/components/shared/Metric"
import Tag from "@/components/shared/Tag"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDaysAgo } from "@/lib/dates.utils"
import type { TQuestion, TTag, TUser } from "@/types"
import Link from "next/link"

type TProps = TQuestion
const QuestionCard = ({
  _id,
  title,
  content,
  views,
  author,
  upVoters,
  downVoters,
  tags,
  answers,
  createdAt,
}: TProps) => {
  const daysAgo = getDaysAgo(createdAt)
  // TODO
  const isAuthor = true

  const numOfVotes = upVoters?.length + downVoters?.length ?? 0
  const numOfAnswers = answers?.length ?? 0

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
        <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
          <Link href={`/questions/${_id}`}>{title}</Link>
        </CardTitle>
        {/* TODO IF SIGNED IN ADD UD ACTIONS */}
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {(tags as TTag[])?.map((tag) => {
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
            imageSrc={(author as TUser)?.picture || "/assets/icons/avatar.svg"}
            alt="avatar"
            className="body-medium text-dark400_light800"
            href={`/users/${(author as TUser)?._id}`}
            isAuthor={isAuthor}
            value={(author as TUser)?.name}
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

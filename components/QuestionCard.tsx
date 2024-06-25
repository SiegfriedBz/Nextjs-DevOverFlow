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

import type { TQuestion } from "@/types"
import Link from "next/link"

type TProps = TQuestion
const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  createdAt,
  numOfVotes,
  answers,
  numOfViews,
}: TProps) => {
  const daysAgo = getDaysAgo(createdAt)
  // TODO
  const isAuthor = true

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
          {tags?.map((tag) => {
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
            imageSrc={author.picture || "/assets/icons/avatar.svg"}
            alt="avatar"
            className="body-medium text-dark400_light800"
            href={`/users/${author._id}`}
            isAuthor={isAuthor}
            value={author.name}
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
              title=" Votes"
            />
            <Metric
              imageSrc="/assets/icons/star.svg"
              alt="numOfAnswers"
              value={answers.length}
              title=" Answers"
            />
            <Metric
              imageSrc="/assets/icons/star.svg"
              alt="numOfViews"
              value={numOfViews}
              title=" Views"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default QuestionCard
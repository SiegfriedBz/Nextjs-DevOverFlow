import MetricSkeleton from "@/components/MetricSkeleton"
import TagSkeleton from "@/components/TagSkeleton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const QuestionListWrapperSkeleton = () => {
  return (
    <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {Array.from({ length: 8 }, (_, index) => {
        return <QuestionCardSkeleton key={index} />
      })}
    </ul>
  )
}

export const ShortQuestionListWrapperSkeleton = () => {
  return (
    <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {Array.from({ length: 8 }, (_, index) => {
        return <QuestionCardSkeleton isShortCard={true} key={index} />
      })}
    </ul>
  )
}

type TProps = {
  isShortCard?: boolean
}
const QuestionCardSkeleton = ({ isShortCard = false }: TProps) => {
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
        <Skeleton className="background-light800_dark300 mb-2 h-12 w-2/3" />

        {!isShortCard && (
          <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
            <Skeleton className="background-light800_dark300 size-full" />
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {!isShortCard && (
          <ul className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, index) => {
              return <TagSkeleton key={`q-${index}`} />
            })}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <div
          className="flex w-full items-center justify-between text-sm 
          max-2xl:flex-col max-2xl:items-start max-2xl:gap-4"
        >
          <MetricSkeleton className="body-medium background-light800_dark300 text-dark400_light800" />

          <div className="flex items-center gap-x-2">
            <MetricSkeleton />
            {!isShortCard && (
              <>
                <MetricSkeleton />
                <MetricSkeleton />
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

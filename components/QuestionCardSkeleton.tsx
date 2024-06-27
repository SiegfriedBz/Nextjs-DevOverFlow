import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MetricSkeleton from "./shared/MetricSkeleton"
import TagSkeleton from "./shared/TagSleleton"

const QuestionCardSkeleton = () => {
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
        <Skeleton className="mb-2 text-xs opacity-80 sm:hidden" />

        <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
          <Skeleton className="size-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }, (_, index) => {
            return <TagSkeleton key={`q-${index}`} />
          })}
        </ul>
      </CardContent>
      <CardFooter>
        <div
          className="flex w-full items-center justify-between text-sm 
          max-2xl:flex-col max-2xl:items-start max-2xl:gap-4"
        >
          <MetricSkeleton className="body-medium text-dark400_light800" />

          <div className="flex items-center gap-x-2">
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default QuestionCardSkeleton

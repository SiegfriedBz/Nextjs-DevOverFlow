import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton"

const TagCardSkeleton = () => {
  return (
    <Card
      className="background-light900_dark200
        text-dark400_light700   
        shadow-light100_darknone 
        light-border rounded-xl
        border
        px-8
        py-10
        shadow-none outline-none
        max-sm:w-full
        sm:w-[260px]
      "
    >
      <CardHeader>
        <CardTitle className="flex w-full justify-center">
          <Skeleton className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <div className="h-4 w-8" />
          </Skeleton>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Skeleton className="background-light800_dark400 flex w-full justify-center rounded-sm px-5 py-1.5">
          <div className="h-16 w-8" />
        </Skeleton>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between space-x-4">
          <Skeleton className="w-fit rounded-sm bg-primary-500 py-1.5">
            <div className="h-2 w-4" />
          </Skeleton>
          <Skeleton className="background-light800_dark400 w-fit rounded-sm px-8 py-1.5">
            <div className="h-2 w-8" />
          </Skeleton>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TagCardSkeleton

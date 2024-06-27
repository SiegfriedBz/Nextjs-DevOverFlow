import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton"

const UserCardSkeleton = () => {
  return (
    <Card
      className="background-light800_darkgradient 
        text-dark400_light700   
        rounded-xl border-none px-4
        py-2
        shadow-none
        outline-none max-xs:w-full
        xs:min-w-[280px]
        xs:max-w-[324px]
        sm:px-10
      "
    >
      <CardHeader>
        <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
          <div className="flex flex-col items-center">
            <Skeleton className="background-light800_dark300 size-32 rounded-full" />
            <Skeleton className="my-4" />
            <Skeleton className="background-light800_dark300 text-light400_light500 mb-2 text-sm lowercase" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <TagListWrapperSkeleton />
      </CardContent>
    </Card>
  )
}

export default UserCardSkeleton

export const TagListWrapperSkeleton = async () => {
  return (
    <ul className="flex justify-center gap-x-4">
      {Array.from({ length: 3 }, (_, index) => {
        return (
          <li key={`user-tag-${index}`}>
            <Skeleton
              className="subtle-medium background-light800_dark300 text-light400_light500 size-full 
                h-6 
                w-12 
                rounded-md 
                border-none 
                px-4 py-2 
                uppercase 
                shadow-md 
                shadow-light-500
                dark:shadow-dark-100
              "
            />
          </li>
        )
      })}
    </ul>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

const TagSkeleton = () => {
  return (
    <Skeleton className="flex justify-between gap-2">
      <Skeleton className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase" />
      <Skeleton className="small-medium text-dark500_light700" />
    </Skeleton>
  )
}

export default TagSkeleton

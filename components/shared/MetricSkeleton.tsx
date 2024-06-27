import { Skeleton } from "@/components/ui/skeleton"

const MetricSkeleton = ({
  className = "small-medium text-dark400_light800",
}: {
  className?: string
}) => {
  return (
    <div className={`${className} flex flex-wrap items-center gap-x-1`}>
      <Skeleton className="invert-colors background-light800_dark300 size-4 rounded-full" />

      <Skeleton>
        <Skeleton className="background-light800_dark300 h-4 w-8" />
      </Skeleton>
    </div>
  )
}

export default MetricSkeleton

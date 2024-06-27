import { Skeleton } from "@/components/ui/skeleton"

const MetricSkeleton = ({
  className = "small-medium text-dark400_light800",
}: {
  className?: string
}) => {
  return (
    <div className={`${className} flex flex-wrap items-center gap-x-1`}>
      <Skeleton className="invert-colors size-4 rounded-full" />

      <Skeleton>
        <Skeleton className="w-4" />
        <Skeleton className="w-8" />
      </Skeleton>
    </div>
  )
}

export default MetricSkeleton

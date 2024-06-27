import { Badge } from "@/components/ui/badge"
import type { TTag } from "@/types"
import Link from "next/link"

type TProps = TTag
const Tag = ({ _id, name, totalQuestions, showCount = false }: TProps) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className="subtle-medium 
          background-light800_dark300 
          text-light400_light500 
          rounded-md 
          border-none 
          px-4 py-2 
          uppercase 
          shadow-md 
          shadow-light-500
          dark:shadow-dark-100
        "
      >
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  )
}

export default Tag

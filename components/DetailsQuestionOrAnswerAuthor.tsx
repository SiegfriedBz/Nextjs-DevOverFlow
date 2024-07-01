import type { TUser } from "@/types"
import Image from "next/image"
import Link from "next/link"

const DetailsQuestionOrAnswerAuthor = ({
  author,
  answeredOn,
}: {
  author: TUser
  answeredOn?: string
}) => {
  return (
    <Link
      href={`/profile/${(author as TUser)?.clerkId}`}
      className="flex max-sm:flex-col max-sm:space-y-1 sm:items-end sm:space-x-8"
    >
      <div className="flex items-center gap-2">
        <Image
          src={(author as TUser)?.picture || "/assets/icons/avatar.svg"}
          width={24}
          height={24}
          alt="author avatar"
          className="invert-colors rounded-full"
        />
        <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap">
          {(author as TUser)?.name}
        </p>
      </div>
      {answeredOn && (
        <span className="inline-block whitespace-nowrap text-sm text-slate-500 max-sm:ms-8 sm:ms-4">
          {answeredOn}
        </span>
      )}
    </Link>
  )
}

export default DetailsQuestionOrAnswerAuthor

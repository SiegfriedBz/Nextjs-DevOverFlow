import { QuestionListWrapperSkeleton } from "@/components/QuestionListWrapperSkeleton"
import QuestionCard from "@/components/questions/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Skeleton } from "@/components/ui/skeleton"
import { SAVED_QUESTIONS_FILTER_OPTIONS } from "@/constants/filters"
import { getQuestionsByTag, getTag } from "@/services/tags.services."
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { toast } from "sonner"

type TProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}
const TagDetailsPage = ({ params, searchParams }: TProps) => {
  return (
    <div>
      <Suspense fallback={<TagWrapperSkeleton />}>
        <TagWrapper params={params} />
      </Suspense>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search tag questions..."
        />

        <CustomFilter
          filterName="sort"
          // TODO
          filterOptions={SAVED_QUESTIONS_FILTER_OPTIONS}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<QuestionListWrapperSkeleton />}>
          <QuestionListWrapper params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default TagDetailsPage

const TagWrapper = async ({ params }: { params: TProps["params"] }) => {
  const tagId = params?.id

  const tag = await getTag({
    filter: {
      _id: tagId,
    },
  })

  if (!tag?.name)
    return <h1 className="h1-bold text-dark100_light900">Tag not found...</h1>

  return <h1 className="h1-bold text-dark100_light900">{tag.name}</h1>
}

const TagWrapperSkeleton = () => {
  return (
    <Skeleton className="background-light800_darkgradient flex h-10 w-32 items-center justify-center">
      <Skeleton className="background-light800_darkgradient h-8 w-24" />
    </Skeleton>
  )
}

const QuestionListWrapper = async ({ params, searchParams }: TProps) => {
  // Get current clerk user
  const clerkUser = await currentUser()

  if (!clerkUser) {
    toast.info("Please sign in")
    redirect("/sign-in")
  }

  const tagId = params?.id

  const localSearchQuery = searchParams?.q
  const globalSearchQuery = searchParams?.globalQ

  // fetch questions pointing to this tag
  const data = await getQuestionsByTag({
    filter: {
      _id: tagId,
    },
    params: { localSearchQuery, globalSearchQuery },
  })

  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
      {data.map((question) => {
        return (
          <li key={question._id}>
            <QuestionCard {...question} />
          </li>
        )
      })}
    </ul>
  ) : (
    <NoResult
      resultType="tag's question"
      paragraphContent="Start browsing other tags"
      href="/tags"
      linkLabel="Browse tags"
    />
  )
}

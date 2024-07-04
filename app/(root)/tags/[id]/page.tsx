import { QuestionListWrapperSkeleton } from "@/components/QuestionListWrapperSkeleton"
import QuestionList from "@/components/questions/QuestionList"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Skeleton } from "@/components/ui/skeleton"
import { QUESTIONS_FILTER_OPTIONS } from "@/constants/filters"
import { getQuestionsByTag, getTag } from "@/services/tags.services."
import { TQuestion } from "@/types"
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
          filterOptions={QUESTIONS_FILTER_OPTIONS}
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

  const pageStr = searchParams?.page
  const page = (pageStr && +pageStr) || 1
  const searchQueryParam = searchParams?.q
  const sortQueryParam = searchParams?.sort

  // fetch questions pointing to this tag
  const data = await getQuestionsByTag({
    filter: {
      _id: tagId,
    },
    maxPageSize:
      (process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE &&
        +process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE) ||
      20,
    params: { page, searchQueryParam, sortQueryParam },
  })

  const questions: TQuestion[] | null = data?.questions
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <QuestionList data={questions}>
          <NoResult
            resultType="tag's question"
            paragraphContent="Start browsing other tags"
            href="/tags"
            linkLabel="Browse tags"
          />
        </QuestionList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

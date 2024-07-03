import { QuestionListWrapperSkeleton } from "@/components/QuestionListWrapperSkeleton"
import QuestionList from "@/components/questions/QuestionList"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { QUESTIONS_FILTER_OPTIONS } from "@/constants/filters"
import { getCurrentUserSavedQuestions } from "@/services/user.services"
import type { TQuestion } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"

type TProps = {
  searchParams?: { [key: string]: string | undefined }
}

const CollectionsPage = ({ searchParams }: TProps) => {
  return (
    <div className="h-full">
      <h1 className="h1-bold text-dark100_light900">Your Saved Questions</h1>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search saved questions..."
        />

        <div className="flex w-full justify-start">
          <CustomFilter
            filterName="sort"
            filterOptions={QUESTIONS_FILTER_OPTIONS}
          />
        </div>
      </div>

      <div className="mt-4 flex size-full flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<QuestionListWrapperSkeleton />}>
          <SavedQuestionListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default CollectionsPage

const SavedQuestionListWrapper = async ({ searchParams }: TProps) => {
  // Get current clerk user
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  const pageStr = searchParams?.page
  const page = (pageStr && parseInt(pageStr, 10)) || 1
  const localSortQuery = searchParams?.sort
  const localSearchQuery = searchParams?.q
  const globalSearchQuery = searchParams?.globalQ

  const data = await getCurrentUserSavedQuestions({
    params: { page, localSortQuery, localSearchQuery, globalSearchQuery },
  })

  const questions: TQuestion[] | null = data?.questions
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <QuestionList data={questions}>
          <NoResult
            resultType="saved question"
            paragraphContent="Browse questions and start adding them to your favorites"
            href="/"
            linkLabel="Browse questions"
          />
        </QuestionList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

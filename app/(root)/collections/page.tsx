import { QuestionListWrapperSkeleton } from "@/components/QuestionListWrapperSkeleton"
import QuestionList from "@/components/questions/QuestionList"
import NoResult from "@/components/shared/NoResult"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { SAVED_QUESTIONS_FILTER_OPTIONS } from "@/constants/filters"
import { getCurrentUserSavedQuestions } from "@/services/user.services"
import type { TQuestion } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { toast } from "sonner"

type TProps = {
  searchParams?: { [key: string]: string | undefined }
}

const CollectionsPage = ({ searchParams }: TProps) => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Your Saved Questions</h1>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search saved questions..."
        />

        <CustomFilter
          filterName="sort"
          filterOptions={SAVED_QUESTIONS_FILTER_OPTIONS}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
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
    toast.info("Please sign in")
    redirect("/sign-in")
  }

  const localSearchQuery = searchParams?.q
  const globalSearchQuery = searchParams?.globalQ

  const data: TQuestion[] | null = await getCurrentUserSavedQuestions({
    params: { localSearchQuery, globalSearchQuery },
  })

  return (
    <QuestionList data={data}>
      <NoResult
        resultType="saved question"
        paragraphContent="Browse questions and start adding them to your favorites"
        href="/"
        linkLabel="Browse questions"
      />
    </QuestionList>
  )
}

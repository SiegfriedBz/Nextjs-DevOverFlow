import QuestionCard from "@/components/QuestionCard"
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
import { QuestionListWrapperSkeleton } from "../(home)/page"

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
          filterName="filter"
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
  const user = await currentUser()

  if (!user) {
    toast.info("Please sign in")
    redirect("/sign-in")
  }

  const data: TQuestion[] | null = await getCurrentUserSavedQuestions({
    searchParams,
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
      resultType="saved question"
      paragraphContent="Browse questions and start adding them to your favorites"
      href="/"
      linkLabel="Browse questions"
    />
  )
}

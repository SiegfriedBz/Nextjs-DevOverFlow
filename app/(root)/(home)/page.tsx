import { QuestionListWrapperSkeleton } from "@/components/QuestionListWrapperSkeleton"
import QuestionList from "@/components/questions/QuestionList"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import { HOME_FILTER_OPTIONS } from "@/constants/filters"
import { getAllQuestions } from "@/services/question.services"
import type { TQuestion } from "@/types"
import Link from "next/link"
import { Suspense } from "react"

type TProps = {
  searchParams: { [key: string]: string | undefined }
}
const Home = ({ searchParams }: TProps) => {
  return (
    <div className="h-full">
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient min-h-11 rounded-xl px-4 py-3 !text-light-900 max-sm:mb-4 max-sm:w-full"
        >
          <Link href="/ask-question">Ask a Question</Link>
        </Button>
      </div>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar queryParamName="q" placeholder="Search questions..." />

        <CustomFilter filterName="sort" filterOptions={HOME_FILTER_OPTIONS} />
      </div>

      <div className="mt-4 flex size-full flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<QuestionListWrapperSkeleton />}>
          <QuestionListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default Home

const QuestionListWrapper = async ({ searchParams }: TProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && +pageStr) || 1
  const searchQueryParam = searchParams?.q
  const sortQueryParam = searchParams?.sort

  const data = await getAllQuestions({
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
            resultType="question"
            paragraphContent="Be the first to break the silence! Ask a question and kickstart a discussion"
            href="/ask-question"
            linkLabel="Ask a question"
          />
        </QuestionList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

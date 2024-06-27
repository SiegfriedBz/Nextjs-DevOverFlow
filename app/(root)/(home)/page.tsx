import QuestionCard from "@/components/QuestionCard"
import QuestionCardSkeleton from "@/components/QuestionCardSkeleton"
import NoResult from "@/components/shared/NoResult"
import HomeFilter from "@/components/shared/search/homeFilter/HomeFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import { getAllQuestions } from "@/services/question.services"
import type { TQuestion, TSearchParamsProps } from "@/types"
import Link from "next/link"
import { Suspense } from "react"

const Home = ({ searchParams }: TSearchParamsProps) => {
  return (
    <div>
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
        <LocalSearchBar />

        <HomeFilter filterName="filter" />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<QuestionListWrapperSkeleton />}>
          <QuestionListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default Home

const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

const QuestionListWrapper = async ({ searchParams }: TSearchParamsProps) => {
  const data: TQuestion[] | null = await getAllQuestions({ searchParams })
  console.log(data)
  console.log("==== HOME searchParams", searchParams)
  console.log("==== HOME data", data)

  await wait(2500)

  return data && data?.length > 0 ? (
    data.map((question) => {
      return <QuestionCard key={question._id} {...question} />
    })
  ) : (
    <NoResult
      resultType="question"
      paragraphContent="Be the first to break the silence! Ask a question and kickstart a
            discussion"
      href="/ask-a-question"
      linkLabel="Ask a question"
    />
  )
}

const QuestionListWrapperSkeleton = () => {
  return Array.from({ length: 8 }, (_, index) => {
    return <QuestionCardSkeleton key={index} />
  })
}

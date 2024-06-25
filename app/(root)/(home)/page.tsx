import HomeFilter from "@/components/shared/search/homeFilter/HomeFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type TSearchParams = {
  searchParams: { [key: string]: string | undefined }
}

const getData = async ({ searchParams }: { searchParams: TSearchParams }) => {
  // const response = await getQuestions({ searchParams })
  return []
}

const Home = async ({ searchParams }: { searchParams: TSearchParams }) => {
  const data = await getData({ searchParams })
  console.log(data)
  console.log("HOME searchParams", searchParams)

  return (
    <div>
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient min-h-11 px-4 py-3 !text-light-900 max-sm:mb-4 max-sm:w-full"
        >
          <Link href="/ask-question">Ask a Question</Link>
        </Button>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar />

        <HomeFilter filterName="filter" />
      </div>
    </div>
  )
}

export default Home

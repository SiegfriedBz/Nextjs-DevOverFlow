import QuestionCard from "@/components/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import HomeFilter from "@/components/shared/search/homeFilter/HomeFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import { Button } from "@/components/ui/button"
import type { TQuestion } from "@/types"
import Link from "next/link"

export type TTag = {
  _id: number
  name: string
  totalQuestions?: number
  showCount?: boolean
}
const QUESTIONS: TQuestion[] = [
  {
    _id: "1",
    title: "What is TypeScript and how does it differ from JavaScript?",
    tags: [
      { _id: "1", name: "TypeScript" },
      { _id: "2", name: "JavaScript" },
    ],
    author: {
      _id: "a1",
      name: "Alice Johnson",
      picture: "",
    },
    createdAt: new Date("2023-01-15T08:00:00Z"),
    numOfVotes: 10000000,
    numOfViews: 1500,
    answers: [],
  },
  {
    _id: "2",
    title: "How do you manage state in a React application?",
    tags: [
      { _id: "3", name: "React" },
      { _id: "4", name: "State Management" },
    ],
    author: {
      _id: "a2",
      name: "Bob Smith",
      picture: "",
    },
    createdAt: new Date("2023-02-20T09:30:00Z"),
    numOfVotes: 25,
    numOfViews: 300,
    answers: [],
  },
  {
    _id: "3",
    title: "What are the benefits of using GraphQL over REST?",
    tags: [
      { _id: "5", name: "GraphQL" },
      { _id: "6", name: "REST" },
    ],
    author: {
      _id: "a3",
      name: "Charlie Brown",
      picture: "",
    },
    createdAt: new Date("2023-03-10T10:15:00Z"),
    numOfVotes: 15,
    numOfViews: 250,
    answers: [],
  },
  {
    _id: "4",
    title: "How does the virtual DOM work in React?",
    tags: [
      { _id: "3", name: "React" },
      { _id: "7", name: "Virtual DOM" },
    ],
    author: {
      _id: "a4",
      name: "Diana Prince",
      picture: "",
    },
    createdAt: new Date("2023-04-05T11:45:00Z"),
    numOfVotes: 30,
    numOfViews: 400,
    answers: [],
  },
  {
    _id: "5",
    title: "What are the main features of Node.js?",
    tags: [
      { _id: "8", name: "Node.js" },
      { _id: "9", name: "JavaScript" },
    ],
    author: {
      _id: "a5",
      name: "Ethan Hunt",
      picture: "",
    },
    createdAt: new Date("2023-05-01T12:00:00Z"),
    numOfVotes: 20,
    numOfViews: 350,
    answers: [],
  },
]

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
        {QUESTIONS?.length > 0 ? (
          QUESTIONS.map((question) => {
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
        )}
      </div>
    </div>
  )
}

export default Home

import AnswerList from "@/components/answers/AnswerList"
import DetailsQuestionOrAnswerHeader from "@/components/DetailsQuestionOrAnswerHeader"
import AnswerForm from "@/components/forms/AnswerForm"
import Metric from "@/components/Metric"
import QuestionMetrics from "@/components/QuestionMetrics"
import QuestionTags from "@/components/QuestionTags"
import SaveQuestionButton from "@/components/SaveQuestionButton"
import Loading from "@/components/shared/Loading"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import { ANSWERS_FILTER_OPTIONS } from "@/constants/filters"
import { getDaysAgo } from "@/lib/dates.utils"
import type { IQuestionDocument } from "@/models/question.model"
import type { IUserDocument } from "@/models/user.model"
import { getAllAnswersForQuestionById } from "@/services/answer.services"
import { getQuestion } from "@/services/question.services"
import { getUser } from "@/services/user.services"
import type { TAnswer, TTag, TUser } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { Suspense } from "react"

// fix hydration error
const ParsedHtml = dynamic(() => import("@/components/shared/ParsedHtml"), {
  ssr: false,
})

type TProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}
const QuestionDetailsPage = async ({ params, searchParams }: TProps) => {
  const { id: questionId } = params

  let question: IQuestionDocument | null = null
  try {
    // We do not populate the question to fetch all answers.
    // Instead, we use getAllAnswers service to which we can pass searchParams.
    question = await getQuestion({
      filter: { _id: questionId },
    })
  } catch (error) {
    console.log("QuestionDetailsPage -> error fetching question", error)
  }

  if (!question) redirect("/")

  // Get current clerk user
  const clerkUser = await currentUser()

  let mongoUserDoc: IUserDocument | null = null
  try {
    if (clerkUser) {
      // Get user from mongodb
      mongoUserDoc = await getUser({
        filter: { clerkId: clerkUser.id },
      })
    }
  } catch (error) {
    console.log("QuestionDetailsPage -> error fetching mongoUser", error)
  }

  // deep copy object (stringify mongo objectId & dates, remove functions) => "passable" to client-component
  const mongoUser = JSON.parse(JSON.stringify(mongoUserDoc))

  const currentUserMongoId = mongoUser?._id as string // stringified to pass to client-component
  const currentUserSavedQuestions = mongoUser?.savedQuestions as string[] // non-populated savedQuestions
  const userHasSavedQuestion = currentUserSavedQuestions?.some(
    (q) => q === questionId
  )

  const {
    // _id: questionId,
    title,
    content,
    views,
    author,
    upVoters, // non-populated string[]
    downVoters, // non-populated string[]
    answers: allAnswersIds, // non-populated answers string[]
    tags,
    createdAt,
  } = question

  const questionNumUpVotes = upVoters?.length ?? 0
  const questionNumDownVotes = downVoters?.length ?? 0
  const userHasUpVotedQuestion = JSON.parse(JSON.stringify(upVoters)).some(
    (voterId: string) => voterId === currentUserMongoId
  )
  const userHasDownVotedQuestion = JSON.parse(JSON.stringify(downVoters)).some(
    (voterId: string) => voterId === currentUserMongoId
  )
  const questionTotalNumAnswers = allAnswersIds?.length ?? 0 // Total Answers for this question
  const daysAgo: number = getDaysAgo(createdAt)

  return (
    <section>
      {/* Question header */}
      <DetailsQuestionOrAnswerHeader
        currentUserMongoId={currentUserMongoId}
        questionId={questionId}
        author={author as unknown as TUser}
        numUpVotes={questionNumUpVotes}
        numDownVotes={questionNumDownVotes}
        currentUserHasUpVoted={userHasUpVotedQuestion}
        currentUserHasDownVoted={userHasDownVotedQuestion}
      >
        {/* Client-Component */}
        <SaveQuestionButton
          questionId={questionId}
          currentUserMongoId={currentUserMongoId}
          userHasSavedQuestion={userHasSavedQuestion}
        />
      </DetailsQuestionOrAnswerHeader>

      {/* Question title */}
      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left max-lg:max-w-md max-md:max-w-72 lg:max-w-lg">
        {title}
      </h2>

      {/* Metrics */}
      <QuestionMetrics
        daysAgo={daysAgo}
        numAnswers={questionTotalNumAnswers}
        views={views}
      />

      {/* Question content */}
      <ParsedHtml data={content} />

      {/* Tags */}
      <QuestionTags
        tags={JSON.parse(JSON.stringify(tags)) as unknown as TTag[]}
      />

      {/* Answers total Counter + Filter */}
      <div className="mb-4 mt-8 flex justify-between max-sm:flex-col max-sm:gap-4 md:flex-col md:items-center">
        <Metric
          imageSrc="/assets/icons/message.svg"
          alt="numOfAnswers"
          value={questionTotalNumAnswers}
          title={` Answer${questionTotalNumAnswers > 1 ? "s" : ""}`}
          className="inline-flex justify-start text-primary-500 max-sm:ps-2 sm:self-center md:self-start"
        />

        <CustomFilter
          filterName="sort"
          filterOptions={ANSWERS_FILTER_OPTIONS}
        />
      </div>

      {/* Answers */}
      <Suspense fallback={<Loading />}>
        <AnswerListWrapper
          currentUserMongoId={currentUserMongoId}
          questionId={questionId}
          searchParams={searchParams}
        />
      </Suspense>

      {/* Answer form */}
      <AnswerForm questionId={questionId} />
    </section>
  )
}

export default QuestionDetailsPage

type TAnswerListWrapperProps = {
  currentUserMongoId: string
  questionId: string
  searchParams: { [key: string]: string | undefined }
}

const AnswerListWrapper = async ({
  currentUserMongoId,
  questionId,
  searchParams,
}: TAnswerListWrapperProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && parseInt(pageStr, 10)) || 1
  const globalSearchQuery = searchParams?.globalQ
  const localSortQuery = searchParams?.sort

  const data = await getAllAnswersForQuestionById({
    questionId,
    params: { page, globalSearchQuery, localSortQuery },
  })

  const answersForQuestion: TAnswer[] | null = data?.answers
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <AnswerList
          data={answersForQuestion}
          currentUserMongoId={currentUserMongoId}
        >
          <NoResult
            resultType="answer"
            paragraphContent="Change your selection to display answers, or write a new answer below."
          />
        </AnswerList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

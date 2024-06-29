import AnswerForm from "@/components/forms/AnswerForm"
import SaveQuestionButton from "@/components/SaveQuestionButton"
import Metric from "@/components/shared/Metric"
import NoResult from "@/components/shared/NoResult"
import ParsedHtml from "@/components/shared/ParsedHtml"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import Tag from "@/components/shared/Tag"
import Voting from "@/components/Voting"
import { ANSWERS_FILTER_OPTIONS } from "@/constants/filters"
import { formatDate, getDaysAgo } from "@/lib/dates.utils"
import { IUserDocument } from "@/models/user.model"
import { getAllAnswers } from "@/services/answer.services"
import { getQuestion } from "@/services/question.services"
import { getUser } from "@/services/user.services"
import type { TAnswer, TQuestion, TTag, TUser } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { Suspense } from "react"

type TProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}
const QuestionDetailsPage = async ({ params, searchParams }: TProps) => {
  const { id: questionId } = params

  let question: TQuestion | null = null
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
  const user = await currentUser()

  let mongoUserDoc: IUserDocument | null = null
  try {
    if (user) {
      // Get user from mongodb
      mongoUserDoc = await getUser({
        filter: { clerkId: user.id },
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
  const userHasUpVotedQuestion = upVoters.some(
    (voterId) => voterId === currentUserMongoId
  )
  const userHasDownVotedQuestion = downVoters.some(
    (voterId) => voterId === currentUserMongoId
  )
  const questionNumAnswers = allAnswersIds?.length ?? 0 // Total Answers for this question
  const daysAgo = getDaysAgo(createdAt)

  return (
    <section>
      {/* Question Header */}
      <Header
        currentUserMongoId={currentUserMongoId}
        questionId={questionId}
        author={author as TUser}
        numUpVotes={questionNumUpVotes}
        numDownVotes={questionNumDownVotes}
        userHasUpVoted={userHasUpVotedQuestion}
        userHasDownVoted={userHasDownVotedQuestion}
      >
        {/* Client-Component */}
        <SaveQuestionButton
          questionId={questionId}
          currentUserMongoId={currentUserMongoId}
          userHasSavedQuestion={userHasSavedQuestion}
        />
      </Header>

      {/* Question title */}
      <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
        {title}
      </h2>

      {/* Metrics */}
      <QuestionMetrics
        daysAgo={daysAgo}
        numAnswers={questionNumAnswers}
        views={views}
      />

      {/* Question content */}
      <ParsedHtml data={content as string} />

      {/* Tags */}
      <QuestionTags tags={tags as TTag[]} />

      {/* Answers Counter + Filter // Answers */}
      <Suspense fallback={<div className="loader my-8" />}>
        <AllAnswers
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

type THeaderProps = {
  children?: React.ReactNode
  currentUserMongoId: string
  author: TUser
  numUpVotes: number
  numDownVotes: number
  userHasUpVoted: boolean
  userHasDownVoted: boolean
} & (
  | {
      // question case
      questionId: string
      answerId?: undefined
      answeredOn?: undefined
    }
  | {
      // answer case
      questionId?: undefined
      answerId: string
      answeredOn: string
    }
)

const Header = ({
  currentUserMongoId,
  author,
  numUpVotes,
  numDownVotes,
  children,
  userHasUpVoted,
  userHasDownVoted,
  // question case
  questionId,
  // answer case
  answerId,
  answeredOn,
}: THeaderProps) => {
  return (
    <>
      {/* Author */}
      <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Author author={author as TUser} answeredOn={answeredOn} />

        {/* Client-Component */}
        <Voting
          className="flex w-full items-center justify-end gap-4"
          currentUserMongoId={currentUserMongoId}
          numUpVotes={numUpVotes}
          numDownVotes={numDownVotes}
          userHasUpVoted={userHasUpVoted}
          userHasDownVoted={userHasDownVoted}
          // question case
          questionId={questionId}
          // answer case
          answerId={answerId}
        >
          {children}
        </Voting>
      </div>
    </>
  )
}

const Author = ({
  author,
  answeredOn,
}: {
  author: TUser
  answeredOn?: string
}) => {
  return (
    <Link
      href={`/profile/${(author as TUser)?._id}`}
      className="flex max-sm:flex-col max-sm:space-y-1 sm:items-end sm:space-x-8"
    >
      <div className="flex items-center gap-2">
        <Image
          src={(author as TUser)?.picture || "/assets/icons/avatar.svg"}
          width={24}
          height={24}
          alt="author avatar"
          className="invert-colors rounded-full"
        />
        <p className="paragraph-semibold text-dark300_light700 whitespace-nowrap">
          {(author as TUser)?.name}
        </p>
      </div>
      {answeredOn && (
        <span className="inline-block whitespace-nowrap text-sm text-slate-500 max-sm:ms-8 sm:ms-4">
          {answeredOn}
        </span>
      )}
    </Link>
  )
}

type TQuestionMetricsProps = {
  daysAgo: number
  numAnswers: number
  views: number
}
const QuestionMetrics = ({
  daysAgo,
  numAnswers,
  views,
}: TQuestionMetricsProps) => {
  return (
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <Metric
        imageSrc="/assets/icons/clock.svg"
        alt="clock icon"
        value={`Asked ${
          daysAgo === 0
            ? "Today"
            : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`
        }`}
      />
      <Metric
        imageSrc="/assets/icons/message.svg"
        alt="numOfAnswers"
        value={numAnswers}
        title={` Answer${numAnswers > 1 ? "s" : ""}`}
      />
      <Metric
        imageSrc="/assets/icons/eye.svg"
        alt="numOfViews"
        value={views}
        title={` View${views > 1 ? "s" : ""}`}
      />
    </div>
  )
}

type TQuestionTagsProps = {
  tags: TTag[]
}
const QuestionTags = ({ tags }: TQuestionTagsProps) => {
  return (
    <ul className="mt-8 flex flex-wrap gap-4">
      {(tags as TTag[]).map((tag) => {
        return (
          <li key={tag.name}>
            <Tag {...tag} />
          </li>
        )
      })}
    </ul>
  )
}

type TAllAnswersProps = {
  currentUserMongoId: string
  questionId: string
  searchParams: { [key: string]: string | undefined }
}
const AllAnswers = async ({
  currentUserMongoId,
  questionId,
  searchParams,
}: TAllAnswersProps) => {
  const selectedAnswers: TAnswer[] = await getAllAnswers({
    filter: { question: questionId },
    searchParams,
  })

  const numAnswers = selectedAnswers.length

  return (
    <>
      {/* Answers Counter + Filter */}
      <div className="mb-4 mt-8 flex justify-between max-sm:flex-col max-sm:gap-4 md:flex-col md:items-center">
        <Metric
          imageSrc="/assets/icons/message.svg"
          alt="numOfAnswers"
          value={numAnswers}
          title={` Answer${numAnswers > 1 ? "s" : ""}`}
          className="inline-flex justify-start text-primary-500 max-sm:ps-2 sm:self-center md:self-start"
        />

        <CustomFilter
          filterName="filter"
          filterOptions={ANSWERS_FILTER_OPTIONS}
        />
      </div>
      <>
        {/* Answers */}
        {selectedAnswers?.length > 0 ? (
          <ul className="flex w-full flex-col gap-8 max-sm:gap-6 [&>*:first-child]:mt-2">
            {(selectedAnswers as TAnswer[])?.map((answer) => {
              const {
                author, // populated user string[]
                content,
                upVoters, // non-populated user string[]
                downVoters, // non-populated user string[]
                createdAt,
              } = answer

              const answerNumUpVotes = upVoters?.length ?? 0
              const answerNumDownVotes = downVoters?.length ?? 0
              const userHasUpVotedAnswer = upVoters.some(
                (voterId) => voterId === currentUserMongoId
              )
              const userHasDownVotedAnswer = downVoters.some(
                (voterId) => voterId === currentUserMongoId
              )

              return (
                <div key={`answer-${answer._id}`} className="">
                  {/* Answer Author + votes */}
                  <Header
                    currentUserMongoId={currentUserMongoId}
                    answerId={answer._id}
                    author={author as TUser}
                    numUpVotes={answerNumUpVotes}
                    numDownVotes={answerNumDownVotes}
                    answeredOn={`answered ${formatDate(createdAt)}`}
                    userHasUpVoted={userHasUpVotedAnswer}
                    userHasDownVoted={userHasDownVotedAnswer}
                  />
                  {/* Answer Content */}
                  <ParsedHtml data={content} />
                </div>
              )
            })}
          </ul>
        ) : (
          <NoResult
            resultType="answer"
            paragraphContent="Try changing your selection to display answers."
          />
        )}
      </>
    </>
  )
}

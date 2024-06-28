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
import Image from "next/image"
import Link from "next/link"
import React, { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

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
  console.log("QuestionDetailsPage -> current clerk user", user)
  console.log("QuestionDetailsPage -> current clerk user?.id", user?.id)
  let mongoUser: IUserDocument | null = null

  try {
    if (user) {
      // Get user from mongodb
      mongoUser = await getUser({
        filter: { clerkId: user.id },
      })
    }
  } catch (error) {
    console.log("QuestionDetailsPage -> error fetching mongoUser", error)
  }

  console.log("QuestionDetailsPage -> mongoUser", mongoUser)

  const currentUserMongoId = mongoUser?._id as string
  const currentUserSavedQuestions =
    mongoUser?.savedQuestions as unknown as string[] // non-populated savedQuestions

  const {
    // _id: questionId,
    title,
    content,
    views,
    author,
    upVoters,
    downVoters,
    answers: allAnswersIds, // non-populated answers
    tags,
    createdAt,
  } = question

  const questionNumUpVotes = upVoters?.length ?? 0
  const questionNumDownVotes = downVoters?.length ?? 0
  const questionNumAnswers = allAnswersIds?.length ?? 0 // Total Answers for this question

  const daysAgo = getDaysAgo(createdAt)

  return (
    <section>
      {/* Question Header */}
      <Header
        currentUserMongoId={currentUserMongoId}
        headerType="question"
        questionId={questionId}
        author={author as TUser}
        numUpVotes={questionNumUpVotes}
        numDownVotes={questionNumDownVotes}
      >
        {/* Client-Component */}
        <SaveQuestionButton
          questionId={questionId}
          currentUserMongoId={currentUserMongoId}
          currentUserSavedQuestions={currentUserSavedQuestions}
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
  currentUserMongoId: string
  author: TUser
  numUpVotes: number
  numDownVotes: number
  children?: React.ReactNode
} & (
  | {
      headerType: "question"
      questionId: string
      answerId?: undefined
      answeredOn?: undefined
    }
  | {
      headerType: "answer"
      questionId?: undefined
      answerId: string
      answeredOn: string
    }
)

const Header = ({
  currentUserMongoId,
  headerType,
  questionId,
  answerId,
  author,
  numUpVotes,
  numDownVotes,
  answeredOn,
  children,
}: THeaderProps) => {
  return (
    <>
      {/* Author */}
      <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <Author author={author as TUser} answeredOn={answeredOn} />

        {/* Voting */}
        <Voting
          className="flex w-full items-center justify-end gap-4"
          currentUserMongoId={currentUserMongoId}
          numUpVotes={numUpVotes}
          numDownVotes={numDownVotes}
          isQuestionVoting={questionId != null}
          questionId={questionId}
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
        title=" Answers"
      />
      <Metric
        imageSrc="/assets/icons/eye.svg"
        alt="numOfViews"
        value={views}
        title=" Views"
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

  return (
    <>
      {/* Answers Counter + Filter */}
      <div className="my-8">
        <span className="text-primary-500">
          {selectedAnswers.length} Answers
        </span>
        <div className="sm:px-4">
          <CustomFilter
            filterName="filter"
            filterOptions={ANSWERS_FILTER_OPTIONS}
          />
        </div>
      </div>
      <>
        {/* Answers */}
        {selectedAnswers?.length > 0 ? (
          <ul className="my-8 flex flex-col gap-8">
            {(selectedAnswers as TAnswer[])?.map((answer) => {
              const {
                author, // populated user
                content,
                upVoters, // non-populated user
                downVoters, // non-populated user
                createdAt,
              } = answer
              const answerNumUpVotes = upVoters?.length ?? 0
              const answerNumDownVotes = downVoters?.length ?? 0

              return (
                <div key={`answer-${answer._id}`} className="">
                  {/* Answer Author + votes */}
                  <Header
                    currentUserMongoId={currentUserMongoId}
                    headerType="answer"
                    answerId={answer._id}
                    author={author as TUser}
                    numUpVotes={answerNumUpVotes}
                    numDownVotes={answerNumDownVotes}
                    answeredOn={`answered ${formatDate(createdAt)}`}
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

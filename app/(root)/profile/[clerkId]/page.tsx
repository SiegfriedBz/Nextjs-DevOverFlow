import ShortAnswerList from "@/components/answers/ShortAnswerList"
import ProfileLink from "@/components/ProfileLink"
import {
  QuestionListWrapperSkeleton,
  ShortQuestionListWrapperSkeleton,
} from "@/components/QuestionListWrapperSkeleton"
import QuestionList from "@/components/questions/QuestionList"
import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserStats from "@/components/UserStats"
import { formatShortDate } from "@/lib/dates.utils"

import {
  getFullUserInfo,
  getUserAnswers,
  getUserQuestions,
} from "@/services/user.services"
import type { TAnswer, TQuestion } from "@/types"
import { SignedIn } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

type TProps = {
  params: { clerkId: string }
  searchParams: { [key: string]: string | undefined }
}
const ProfilePage = async ({ params, searchParams }: TProps) => {
  const clerkId = params.clerkId

  const { user, userTotalQuestions, userTotalAnswers } = await getFullUserInfo({
    filter: { clerkId },
  })

  if (!user) {
    redirect("/community")
  }

  const currentClerkUser = await currentUser()
  const currentUserClerkId = currentClerkUser?.id
  const isCurrentUserProfile = currentUserClerkId === clerkId

  return (
    <div className="max-w-full">
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col-reverse items-start gap-4 lg:flex-row">
          <Image
            src={user.picture}
            alt="user avatar"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.userName.split(" ").join("")}
            </p>

            <div className="paragraph-regular text-dark200_light800 mt-5 flex flex-wrap items-start gap-5">
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                label={`Joined ${formatShortDate(user.joinedDate)}`}
              />
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  label="Portfolio"
                  href={user.portfolio}
                  target="_blank"
                />
              )}
              {user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  label={user.location}
                />
              )}
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        {/* Edit Profile Button */}
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {isCurrentUserProfile && (
            <SignedIn>
              <Button
                asChild
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 rounded-xl p-1"
              >
                <Link href={`/profile/${clerkId}/edit`}>Edit Profile</Link>
              </Button>
            </SignedIn>
          )}
        </div>
      </div>

      {/* Stats */}
      <div>
        <UserStats
          totalQuestions={userTotalQuestions}
          totalAnswers={userTotalAnswers}
        />
      </div>

      {/* Tabs */}
      <div className="mt-10 flex h-full gap-10">
        <Tabs defaultValue="top-posts" className="w-full">
          <TabsList className="background-light800_dark400 text-dark300_light900 min-h-12 space-x-2 rounded-xl">
            <TabsTrigger className="tab rounded-xl px-4 py-2" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab rounded-xl px-4 py-2" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <Suspense fallback={<QuestionListWrapperSkeleton />}>
              <QuestionListWrapper
                searchParams={searchParams}
                currentUserClerkId={currentUserClerkId}
                userName={user.name}
                userId={user._id as string}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="answers">
            <Suspense fallback={<ShortQuestionListWrapperSkeleton />}>
              <AnswerListWrapper
                searchParams={searchParams}
                currentUserClerkId={currentUserClerkId}
                userName={user.name}
                userId={user._id as string}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      {/* Top Tags */}
      <div>Top Tags</div>
    </div>
  )
}

export default ProfilePage

type TTabsProps = {
  searchParams: { [key: string]: string | undefined }
  currentUserClerkId?: string
  userId: string
  userName: string
}

// fetch all user's questions
const QuestionListWrapper = async ({
  searchParams,
  currentUserClerkId,
  userId,
  userName,
}: TTabsProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && +pageStr) || 1

  const data = await getUserQuestions({
    maxPageSize:
      (process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE &&
        +process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE) ||
      20,
    userId,
    params: { page },
  })

  const userQuestions: TQuestion[] | null = data?.questions
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <QuestionList
          data={userQuestions}
          currentUserClerkId={currentUserClerkId}
        >
          <NoResult
            resultType="question"
            paragraphContent={`${userName} did not post questions yet.`}
            href="/community"
            linkLabel="Visit other profiles"
          />
        </QuestionList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

// fetch all user's answers populated with answer's author and answer's question
const AnswerListWrapper = async ({
  searchParams,
  currentUserClerkId,
  userId,
  userName,
}: TTabsProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && +pageStr) || 1

  const data = await getUserAnswers({
    maxPageSize:
      (process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE &&
        +process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE) ||
      20,
    userId,
    params: { page },
  })

  const userAnswers: TAnswer[] | null = data?.answers
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <ShortAnswerList
          data={userAnswers}
          currentUserClerkId={currentUserClerkId}
        >
          <NoResult
            resultType="answer"
            paragraphContent={`${userName} did not post answers yet.`}
            href="/community"
            linkLabel="Visit other profiles"
          />
        </ShortAnswerList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

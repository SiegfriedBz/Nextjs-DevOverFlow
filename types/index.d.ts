import { BADGE_CRITERIA } from "@/constants"
import type { IAnswerDocument } from "@/models/answer.model"
import type { IQuestionDocument } from "@/models/question.model"
import type { ITagDocument } from "@/models/tag.model"
import type { IUserDocument } from "@/models/user.model"

export type TTheme = {
  value: "light" | "dark" | "system"
  label: string
  icon: string
}

export type TQueryParams = {
  page: number
  localSearchQuery?: string // ?q=
  globalSearchQuery?: string // ?globalQ=
  localSortQuery?: string // ?sort=
}

export type TUser = {
  _id: string
  name: string
  picture: string
  clerkId: string
  userName: string
  email: string
  userName: string
  reputation: number
  joinedDate: Date
  location: string
  bio: string
  portfolio: string
  savedQuestions: IQuestionDocument[] | string[]
}

export type TTag = {
  _id: string
  name: string
  description?: string
  questions?: IQuestionDocument[] | string[]
  followers?: IUserDocument[] | string[]
  createdAt?: Date
  // totalQuestions?: number
  // showCount?: boolean
}

// TODO
export type TAnswer = {
  _id: string
  author: IUserDocument | string
  content: string
  views: number
  createdAt: Date
  upVoters: IUserDocument[] | string[]
  downVoters: IUserDocument[] | string[]
  question: IQuestionDocument | string
}

export type TQuestion = {
  _id: string
  author: IUserDocument | string
  title: string
  content: string
  views: number
  upVoters: IUserDocument[] | string[]
  downVoters: IUserDocument[] | string[]
  tags: ITagDocument[] | string[]
  answers: IAnswerDocument[] | string[]
  createdAt: Date
}

export interface ISidebarLink {
  imgURL: string
  href: string
  label: string
}

export type TJob = {
  id?: string
  employer_name?: string
  employer_logo?: string | undefined
  employer_website?: string
  job_employment_type?: string
  job_title?: string
  job_description?: string
  job_apply_link?: string
  job_city?: string
  job_state?: string
  job_country?: string
}

export type TCountry = {
  name: {
    common: string
  }
}

export type TGetAllQuestionsParams = {
  page?: number
  resultsPerPage?: number
  searchQuery?: string
  filter?: string
}

export type TParamsProps = {
  params: { id: string }
}

export type TSearchParamsProps = {
  searchParams: { [key: string]: string | undefined }
}

export type TURLProps = {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export type TBadgeCounts = {
  GOLD: number
  SILVER: number
  BRONZE: number
}

export type TBadgeCriteria = keyof typeof BADGE_CRITERIA

import { BADGE_CRITERIA } from "@/constants"

export type TUser = {
  _id: string
  name: string
  picture: string
  clerckId: string
  userName: string
  email: string
  userName: string
  reputation: number
  joinedDate: Date
  location: object
  savedQuestions: Array<object>
}

export type TTag = {
  _id: string
  name: string
  totalQuestions?: number
  showCount?: boolean
}

export type TQuestion = {
  _id?: string
  title: string
  description: string
  tags: TTag[]
  numOfVotes: number
  numOfViews: number
  answers: Array<object>
  createdAt: Date
  author: TUser
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

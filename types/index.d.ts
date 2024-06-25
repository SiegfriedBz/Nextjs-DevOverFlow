import { BADGE_CRITERIA } from "@/constants"

export interface ISidebarLink {
  imgURL: string
  href: string
  label: string
}

export interface IJob {
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

export interface ICountry {
  name: {
    common: string
  }
}

export interface IParamsProps {
  params: { id: string }
}

export interface ISearchParamsProps {
  searchParams: { [key: string]: string | undefined }
}

export interface IURLProps {
  params: { id: string }
  searchParams: { [key: string]: string | undefined }
}

export interface IBadgeCounts {
  GOLD: number
  SILVER: number
  BRONZE: number
}

export type TBadgeCriteria = keyof typeof BADGE_CRITERIA

export type TTag = {
  _id: string
  name: string
  totalQuestions?: number
  showCount?: boolean
}

export type TQuestion = {
  _id: string
  title: string
  tags: TTag[]
  author: {
    _id: string
    name: string
    picture: string
  }
  createdAt: Date
  numOfVotes: number
  numOfViews: number
  answers: Array<object>
}

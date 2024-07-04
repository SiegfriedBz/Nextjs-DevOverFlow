"use client"

import Loading from "@/components/shared/Loading"
import { formatShortDate } from "@/lib/dates.utils"
import { IUserDocument } from "@/models/user.model"
import { getGlobalData } from "@/services/global.services"
import type {
  TAnswer,
  TGlobalResultData,
  TQuestion,
  TTag,
  TUser,
} from "@/types"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"

type TProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalSearchResult = ({ setIsOpen }: TProps) => {
  const [isLoading, setIsloading] = useState(false)
  const [result, setResult] = useState<TGlobalResultData>(null)
  const searchParams = useSearchParams()
  const globalSearchQueryParam = searchParams?.get("globalQ") ?? undefined
  const globalFilterName =
    searchParams?.get("globalFilter")?.toLowerCase() ?? undefined

  const fetchData = useCallback(async () => {
    if (!globalFilterName) return null

    const data: TGlobalResultData = await getGlobalData({
      globalFilterName,
      params: {
        searchQueryParam: globalSearchQueryParam,
      },
    })

    return data
  }, [globalFilterName, globalSearchQueryParam])

  useEffect(() => {
    ;(async () => {
      try {
        setIsloading(true)

        const data: TGlobalResultData = await fetchData()
        setResult(data)
      } catch (error) {
        console.log("GlobalSearchResult -> ERROR", error)
      } finally {
        setIsloading(false)
      }
    })()
  }, [fetchData])

  if (globalSearchQueryParam && !globalFilterName) {
    return <span className="text-dark100_light900">Select a filter</span>
  }

  if (isLoading)
    return (
      <div className="-mt-4 flex h-16 w-full justify-center">
        <div>
          <Loading />
        </div>
      </div>
    )

  return (
    <GlobalResultList
      data={result}
      globalFilterName={globalFilterName}
      setIsOpen={setIsOpen}
    />
  )
}

export default GlobalSearchResult

type TGlobalResultListProps = {
  data: TGlobalResultData
  globalFilterName?: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const GlobalResultList = ({
  data,
  globalFilterName,
  setIsOpen,
}: TGlobalResultListProps) => {
  const results =
    globalFilterName === "question"
      ? (
          data as {
            questions: TQuestion[]
          }
        )?.questions
      : globalFilterName === "answer"
        ? (
            data as {
              answers: TAnswer[]
            }
          )?.answers
        : globalFilterName === "tag"
          ? (
              data as {
                tags: TTag[]
              }
            )?.tags
          : globalFilterName === "profile"
            ? (
                data as {
                  users: TUser[]
                }
              )?.users
            : []

  return results?.length > 0 ? (
    <>
      <span className="text-dark100_light900">Top Match</span>
      <ul className="no-scrollbar flex max-h-64 w-full flex-col gap-4 overflow-y-scroll py-4">
        {results.map((result) => {
          return (
            <GlobalResultCard
              key={result._id}
              result={result}
              globalFilterName={globalFilterName}
              setIsOpen={setIsOpen}
            />
          )
        })}
      </ul>
    </>
  ) : (
    <span>Oooopps no result found</span>
  )
}

type TGlobalResultCardProps = {
  result: TQuestion | TAnswer | TTag | TUser
  globalFilterName?: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const GlobalResultCard = ({
  result,
  globalFilterName,
  setIsOpen,
}: TGlobalResultCardProps) => {
  return (
    <Link
      href={href({ result, globalFilterName })}
      onClick={() => {
        // close dialog
        setIsOpen(false)
      }}
      className="flex w-full cursor-pointer items-start gap-4 rounded-xl px-4 py-2.5 hover:bg-light-700/50"
    >
      <div className="flex gap-2">
        <Image
          src="/assets/icons/tag.svg"
          alt="match"
          width={18}
          height={18}
          className="invert-colors mt-1 object-contain"
        />

        {globalFilterName === "question" ? (
          <div className="flex flex-col gap-4">
            <span className="body-medium text-dark200_light800 line-clamp-1">
              {(result as TQuestion)?.title}
            </span>
            {/* TODO check author is populated in getAllQuestions */}
            <span className="body-medium text-dark200_light800 line-clamp-1">
              By {((result as TQuestion)?.author as IUserDocument).name} on{" "}
              {formatShortDate((result as TQuestion)?.createdAt)}
            </span>
          </div>
        ) : globalFilterName === "answer" ? (
          <div className="flex flex-col gap-4">
            <span className="body-medium text-dark200_light800 line-clamp-1">
              {(result as TAnswer)?.content}
            </span>
            {/* TODO check author is populated in getAllAnswers */}
            <span className="body-medium text-dark200_light800 line-clamp-1">
              By {((result as TAnswer)?.author as IUserDocument).name} on{" "}
              {formatShortDate((result as TAnswer)?.createdAt)}
            </span>
          </div>
        ) : globalFilterName === "tag" ? (
          <span className="body-medium text-dark200_light800 line-clamp-1">
            {(result as TTag)?.name}
          </span>
        ) : globalFilterName === "profile" ? (
          <div className="flex items-center gap-4">
            <Image
              src={(result as TUser)?.picture}
              alt="user avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="body-medium text-dark200_light800 line-clamp-1">
              {(result as TUser)?.name}
            </span>
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </Link>
  )
}

// Helpers
const href = ({
  result,
  globalFilterName,
}: {
  result: TQuestion | TAnswer | TTag | TUser
  globalFilterName?: string
}) => {
  let href: string = ""

  switch (globalFilterName) {
    case "question":
      href = `/questions/${result?._id}`
      break
    case "answer":
      // TODO CHECK question is populated in getAllAnswers
      href = `/questions/${(result as TAnswer)?.question}`
      break
    case "tag":
      href = `/tags/${result?._id}`
      break
    case "profile":
      href = `/profile/${(result as TUser)?.clerkId}`
      break
  }
  return href
}

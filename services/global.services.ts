"use server"

import type { TQueryParams, TGlobalResultData } from "@/types"
import { getAllAnswers } from "./answer.services"
import { getAllQuestions } from "./question.services"
import { getAllTags } from "./tags.services."
import { getAllUsers } from "./user.services"

export async function getGlobalData({
  globalFilterName,
  params,
}: {
  globalFilterName: string
  params: TQueryParams
}): Promise<TGlobalResultData> {
  const { searchQueryParam = "" } = params

  let data: TGlobalResultData = null

  try {
    switch (globalFilterName) {
      case "question":
        data = await getAllQuestions({
          params: {
            searchQueryParam,
          },
        })
        break
      case "answer":
        data = await getAllAnswers({ params: { searchQueryParam } })
        break
      case "tag":
        data = await getAllTags({ params: { searchQueryParam } })
        break
      case "profile":
        data = await getAllUsers({ params: { searchQueryParam } })
        break
    }

    return data
  } catch (error) {
    console.log("getGlobalData ERROR", error)
    throw error
  }
}

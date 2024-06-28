"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateAnswerInput } from "@/lib/zod/answer.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import User from "@/models/user.model"
import type { TAnswer } from "@/types"
import { FilterQuery } from "mongoose"

export async function getAllAnswers({
  filter = {}, // to get all answers for question._id
  searchParams,
}: {
  filter?: FilterQuery<IAnswerDocument> | undefined
  searchParams: { [key: string]: string | undefined }
}) {
  try {
    await connectToMongoDB()

    console.log("getAllAnswers filter", filter)
    console.log("getAllAnswers searchParams", searchParams)

    // TODO
    // HANDLE searchParams
    // const {
    //   page = 1,
    //   numOfResultsPerPage = 10,
    //   filter = "",
    //   searchQuery = "",
    // } = searchParams

    const answers = await Answer.find({ ...(filter || {}) })
      .populate([
        { path: "author", model: User },
        { path: "upVoters", model: User },
        { path: "downVoters", model: User },
      ])
      .sort({ createdAt: -1 })
    // .lean()

    return JSON.parse(JSON.stringify(answers))
  } catch (error) {
    const err = error as Error
    console.log("getAllAnswers Error", err.message)
    throw new Error(
      `Something went wrong when fetching answers - ${err.message}`
    )
  }
}

export async function createAnswer({
  data,
}: {
  data: TMutateAnswerInput & {
    author: IAnswerDocument["author"]
  }
}): Promise<TAnswer> {
  try {
    await connectToMongoDB()

    const newAnswerDoc = await Answer.create({
      ...data,
    })

    const newAnswer = JSON.parse(JSON.stringify(newAnswerDoc))

    return newAnswer
  } catch (error) {
    const err = error as Error
    console.log("createAnswer Error", err)
    throw new Error(
      `Something went wrong when creating answer - ${err.message}`
    )
  }
}

export async function findAndDeleteManyAnswers({
  filter,
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Answer.deleteMany(filter)

    // if (!result.deletedCount) {
    //   throw new Error(`No answers found for the given filter`)
    // }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== findAndDeleteManyAnswers Error", err)
    throw new Error(
      `Something went wrong when deleting answers - ${err.message}`
    )
  }
}

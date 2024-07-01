"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateAnswerInput } from "@/lib/zod/answer.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import type { IQuestionDocument } from "@/models/question.model"
import User from "@/models/user.model"
import type { TAnswer } from "@/types"
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getAllAnswers({
  filter = {}, // to get all answers for question._id
  searchParams,
  options = {},
}: {
  filter?: FilterQuery<IAnswerDocument> | undefined
  searchParams: { [key: string]: string | undefined }
  options?: QueryOptions<any> | null | undefined
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
        // { path: "upVoters", model: User },
        // { path: "downVoters", model: User },
      ])
      .sort({ createdAt: -1 })
    // .lean()

    return JSON.parse(JSON.stringify(answers))
  } catch (error) {
    const err = error as Error
    console.log("getAllAnswers Error", err.message)
    throw new Error(`Could not fetch answers - ${err.message}`)
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
    throw new Error(`Could not create answer - ${err.message}`)
  }
}

export async function updateAnswer({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
  data: UpdateQuery<IAnswerDocument> | undefined
  options?: QueryOptions<IAnswerDocument> | null | undefined
}): Promise<IAnswerDocument | null> {
  try {
    await connectToMongoDB()

    const updatedAnswer: IAnswerDocument | null = await Answer.findOneAndUpdate(
      filter,
      data,
      options
    )

    console.log("updateAnswer updatedAnswer", updatedAnswer)

    // TODO
    // if (!updatedAnswer?._id) {
    //   throw new Error(`Answer not found`)
    // }

    return updatedAnswer
  } catch (error) {
    const err = error as Error
    console.log("===== updateAnswer Error", err)
    throw new Error(`Could not update answer - ${err.message}`)
  }
}

export async function deleteAnswer({
  filter,
  options = {},
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
  options?: QueryOptions<IAnswerDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const deletedDocument = await Answer.findOneAndDelete(filter, options)

    if (!deletedDocument) {
      throw new Error(`Answer not found`)
    }

    return deletedDocument
  } catch (error) {
    const err = error as Error
    console.log("===== deleteAnswer Error", err)
    throw new Error(`Could not delete answer - ${err.message}`)
  }
}

export async function deleteManyAnswers({
  filter,
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Answer.deleteMany(filter)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteManyAnswers Error", err)
    throw new Error(`Could not delete answers - ${err.message}`)
  }
}

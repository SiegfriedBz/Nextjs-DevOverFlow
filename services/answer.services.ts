"use server"

import { NUM_RESULTS_PER_PAGE } from "@/constants"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateAnswerInput } from "@/lib/zod/answer.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import type { IQuestionDocument } from "@/models/question.model"
import User from "@/models/user.model"
import type { TAnswer, TQueryParams } from "@/types"
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getAllAnswersForQuestionById({
  questionId,
  params,
}: {
  questionId: string
  params: Omit<TQueryParams, "localSearchQuery">
}): Promise<{
  answers: TAnswer[]
  hasNextPage: boolean
}> {
  try {
    const {
      page = 1,
      // globalSearchQuery = "",
      localSortQuery,
    } = params

    await connectToMongoDB()

    // Build searchQuery on Answer
    const searchQuery: FilterQuery<IAnswerDocument> = { question: questionId }

    // Build sortQuery on Answer
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "highest_upvotes":
        sortQuery = { upVoters: -1 }
        break
      case "lowest_upvotes":
        sortQuery = { upVoters: 1 }
        break
      case "most_recent":
        sortQuery = { createdAt: -1 }
        break
      case "oldest":
        sortQuery = { createdAt: 1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    // Pagination
    const limit = NUM_RESULTS_PER_PAGE
    const skip = (page - 1) * NUM_RESULTS_PER_PAGE

    // Perform query
    const result = await Answer.find(searchQuery)
      .populate([
        { path: "author", model: User, select: "_id clerkId name picture" },
      ])
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)

    // Pagination data
    const totalDocs = await Answer.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result.length

    // format
    const answers = JSON.parse(JSON.stringify(result))

    return { answers, hasNextPage }
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

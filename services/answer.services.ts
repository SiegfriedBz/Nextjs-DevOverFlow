"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateAnswerInput } from "@/lib/zod/answer.zod"
import Answer, { IAnswerDocument } from "@/models/answer.model"
import type { IQuestionDocument } from "@/models/question.model"
import User from "@/models/user.model"
import type { TAnswer, TQueryParams } from "@/types"
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getAllAnswers({
  maxPageSize = 1000,
  params,
}: {
  maxPageSize?: number
  params: TQueryParams
}): Promise<{
  answers: TAnswer[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1, searchQueryParam = "", sortQueryParam } = params

    await connectToMongoDB()

    // Build searchQuery on Answer
    const searchQuery: FilterQuery<IAnswerDocument> = {}

    if (searchQueryParam) {
      searchQuery.$or = [
        {
          title: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
        {
          content: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
      ]
    }

    // Build sortQuery on Answer
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (sortQueryParam) {
      // OK
      case "newest":
        sortQuery = { createdAt: -1 }
        break
      // OK
      case "unanswered":
        searchQuery.answers = { $size: 0 }
        break
      case "frequent":
        sortQuery = { views: -1 }
        break
      case "recommended":
        sortQuery = { upVoters: -1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    // Pagination
    const limit = maxPageSize
    const skip = (page - 1) * maxPageSize

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

export async function getAllAnswersForQuestionById({
  maxPageSize = 1000,
  questionId,
  params,
}: {
  maxPageSize?: number
  questionId: string
  params: Omit<TQueryParams, "searchQueryParam">
}): Promise<{
  answers: TAnswer[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1, sortQueryParam } = params

    await connectToMongoDB()

    // Build searchQuery on Answer
    const searchQuery: FilterQuery<IAnswerDocument> = { question: questionId }

    // Build sortQuery on Answer
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (sortQueryParam) {
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
    const limit = maxPageSize
    const skip = (page - 1) * maxPageSize

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

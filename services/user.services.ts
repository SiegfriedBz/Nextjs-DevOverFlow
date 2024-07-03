"use server"

import type { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import { NUM_RESULTS_PER_PAGE } from "@/constants"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateUserInput } from "@/lib/zod/user.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User, { type IUserDocument } from "@/models/user.model"
import type { TAnswer, TQueryParams, TQuestion, TUser } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import { redirect } from "next/navigation"

export async function getAllUsers({
  params,
}: {
  params: TQueryParams
}): Promise<{
  users: TUser[]
  hasNextPage: boolean
}> {
  try {
    const {
      page = 1,
      localSearchQuery = "",
      // globalSearchQuery = "",
      localSortQuery,
    } = params

    await connectToMongoDB()

    // Build searchQuery
    const searchQuery: FilterQuery<IUserDocument> = {}

    if (localSearchQuery) {
      searchQuery.$or = [
        { name: { $regex: localSearchQuery, $options: "i" } },
        { userName: { $regex: localSearchQuery, $options: "i" } },
        { location: { $regex: localSearchQuery, $options: "i" } },
        { bio: { $regex: localSearchQuery, $options: "i" } },
      ]
    }

    // Build sortQuery
    let sortQuery: Record<string, 1 | -1>
    switch (localSortQuery) {
      case "new_users":
        sortQuery = { createdAt: -1 }
        break
      case "old_users":
        sortQuery = { createdAt: 1 }
        break
      case "top_contributors":
        sortQuery = { reputation: -1 }
        break
      default: {
        sortQuery = { createdAt: -1 }
      }
    }

    // Pagination
    const limit = NUM_RESULTS_PER_PAGE
    const skip = (page - 1) * NUM_RESULTS_PER_PAGE

    // Perform query
    const result = await User.find(searchQuery)
      .populate([{ path: "savedQuestions", model: Question }])
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)

    // Pagination data
    const totalDocs = await User.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result.length

    // format
    const users = JSON.parse(JSON.stringify(result))

    return { users, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getAllUsers Error", err.message)
    throw new Error(`Could not fetch users - ${err.message}`)
  }
}

export async function getUser({
  filter,
}: {
  filter: FilterQuery<IUserDocument>
}): Promise<IUserDocument> {
  try {
    await connectToMongoDB()

    const user: IUserDocument | null = await User.findOne(filter)
    if (!user?._id) {
      throw new Error(`User not found`)
    }

    return user
  } catch (error) {
    const err = error as Error
    console.log("getUser Error", err.message)
    throw new Error(`Could not fetch user - ${err.message}`)
  }
}

export async function getUserForEdit({
  filter,
}: {
  filter: FilterQuery<IUserDocument>
}): Promise<TMutateUserInput> {
  try {
    await connectToMongoDB()

    const userDocument: IUserDocument | null = await User.findOne(filter, {
      name: 1,
      userName: 1,
      portfolio: 1,
      location: 1,
      bio: 1,
    })
    if (!userDocument?._id) {
      throw new Error(`User not found`)
    }

    const user: TMutateUserInput = JSON.parse(JSON.stringify(userDocument))

    return user
  } catch (error) {
    const err = error as Error
    console.log("getUser Error", err.message)
    throw new Error(`Could not fetch user - ${err.message}`)
  }
}

export async function createUser(
  userData: TMutateUserData
): Promise<IUserDocument> {
  try {
    await connectToMongoDB()

    const newUser: IUserDocument = await User.create(userData)

    return newUser
  } catch (error) {
    const err = error as Error
    console.log("createUser Error", err.message)
    throw new Error(`Could not create user - ${err.message}`)
  }
}

export async function updateUser({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IUserDocument> | undefined
  data: UpdateQuery<IUserDocument> | undefined
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    await connectToMongoDB()

    const updatedUser = await User.findOneAndUpdate(filter, data, options)
    if (!updatedUser?._id) {
      throw new Error(`User not found`)
    }

    return updatedUser
  } catch (error) {
    const err = error as Error
    console.log("updateUser Error", err.message)
    throw new Error(`Could not update user - ${err.message}`)
  }
}

export async function deleteUser({
  filter,
  options = {},
}: {
  filter: FilterQuery<IUserDocument> | undefined
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await User.findOneAndDelete(filter, options)
    if (!result.value) {
      throw new Error(`User not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("deleteUser Error", err.message)
    throw new Error(`Could not delete user - ${err.message}`)
  }
}

export async function getFullUserInfo({
  filter,
}: {
  filter: FilterQuery<IUserDocument>
}): Promise<{
  user: IUserDocument
  userTotalQuestions: number
  userTotalAnswers: number
}> {
  try {
    await connectToMongoDB()

    const user: IUserDocument | null = await User.findOne(filter)

    if (!user?._id) {
      throw new Error(`User not found`)
    }

    const userTotalQuestions = await Question.countDocuments({
      author: user._id,
    })
    const userTotalAnswers = await Answer.countDocuments({ author: user._id })

    return { user, userTotalQuestions, userTotalAnswers }
  } catch (error) {
    const err = error as Error
    console.log("getUser Error", err.message)
    throw new Error(`Could not fetch user - ${err.message}`)
  }
}

export async function getCurrentUserSavedQuestions({
  params,
}: {
  params: TQueryParams
}): Promise<{
  questions: TQuestion[]
  hasNextPage: boolean
}> {
  try {
    const {
      page = 1,
      localSearchQuery = "",
      // globalSearchQuery = "",
      localSortQuery = "",
    } = params

    /** get user from from clerk db */
    const clerckUser = await currentUser()

    if (!clerckUser) {
      redirect("/sign-in")
    }

    const clerkId = clerckUser?.id

    /** connect to mongo db */
    await connectToMongoDB()

    // Build searchQuery on Question
    const searchQuery: FilterQuery<IQuestionDocument> = {}

    if (localSearchQuery) {
      searchQuery.$or = [
        { title: { $regex: new RegExp(localSearchQuery, "i") } },
        { content: { $regex: new RegExp(localSearchQuery, "i") } },
      ]
    }

    // Build sortQuery on Question
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "most_recent":
        sortQuery = { createdAt: -1 }
        break
      case "oldest":
        sortQuery = { createdAt: 1 }
        break
      case "most_viewed":
        sortQuery = { views: -1 }
        break
      case "highest_upvotes":
        sortQuery = { upVoters: -1 }
        break
      case "lowest_upvotes":
        sortQuery = { upVoters: 1 }
        break
      default:
        sortQuery = {
          createdAt: -1,
        }
    }

    // Pagination
    const limit = NUM_RESULTS_PER_PAGE
    const skip = (page - 1) * NUM_RESULTS_PER_PAGE

    // Perform query
    const result = await User.findOne(
      { clerkId },
      { savedQuestions: 1 }
    ).populate({
      path: "savedQuestions",
      match: searchQuery as FilterQuery<IQuestionDocument>,
      options: {
        skip,
        limit: limit + 1, // for pagination, fetch and include next page (+1 result)
        sort: sortQuery,
      },
      populate: [
        { path: "author", model: User, select: "_id clerkId name picture" },
        { path: "tags", model: Tag, select: "_id name" },
        { path: "upVoters", model: User },
        { path: "downVoters", model: User },
        { path: "answers", model: Answer },
      ],
    })

    const userSavedQuestions = result?.savedQuestions || []

    // Pagination data
    const hasNextPage = userSavedQuestions.length > NUM_RESULTS_PER_PAGE

    // format
    const questions = JSON.parse(JSON.stringify(userSavedQuestions || []))

    return { questions, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getCurrentUserSavedQuestions Error", err.message)
    throw new Error(`Could not fetch saved questions - ${err.message}`)
  }
}

export async function getUserQuestions({
  userId,
  params,
}: {
  userId: string
  params: Omit<
    TQueryParams,
    "localSearchQuery" | "globalSearchQuery" | "localSortQuery"
  >
}): Promise<{
  questions: TQuestion[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1 } = params

    await connectToMongoDB()

    // Pagination
    const limit = NUM_RESULTS_PER_PAGE
    const skip = (page - 1) * NUM_RESULTS_PER_PAGE

    // Build searchQuery
    const searchQuery: FilterQuery<IQuestionDocument> = {
      author: userId,
    }

    // Perform query
    const result: IQuestionDocument[] = await Question.find(searchQuery)
      .populate([
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ views: -1, upVoters: -1 })

    // Pagination data
    const totalDocs = await Question.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result.length

    // format
    const questions: TQuestion[] = JSON.parse(JSON.stringify(result))

    return { questions, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getUserQuestions Error", err.message)
    throw new Error(`Could not fetch user's questions - ${err.message}`)
  }
}

export async function getUserAnswers({
  userId,
  params,
}: {
  userId: string
  params: Omit<
    TQueryParams,
    "localSearchQuery" | "globalSearchQuery" | "localSortQuery"
  >
}): Promise<{
  answers: TAnswer[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1 } = params

    await connectToMongoDB()

    // Pagination
    const limit = NUM_RESULTS_PER_PAGE
    const skip = (page - 1) * NUM_RESULTS_PER_PAGE

    // Build searchQuery
    const searchQuery: FilterQuery<IAnswerDocument> = {
      author: userId,
    }

    // Perform query
    const result: IAnswerDocument[] = await Answer.find(searchQuery, {
      content: 1,
      author: 1,
      upVoters: 1,
      createdAt: 1,
      question: 1,
    })
      .populate([
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
        {
          path: "question",
          model: Question,
          select: "_id title",
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ views: -1, upVoters: -1 })

    // Pagination data
    const totalDocs = await Answer.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result.length

    // format
    const answers: TAnswer[] = JSON.parse(JSON.stringify(result))

    return { answers, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getUserAnswers Error", err.message)
    throw new Error(`Could not fetch user's answers - ${err.message}`)
  }
}

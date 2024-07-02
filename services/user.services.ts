"use server"

import type { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import { NUM_RESULTS_PER_PAGE } from "@/constants"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateUserInput } from "@/lib/zod/user.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User, { type IUserDocument } from "@/models/user.model"
import type { TQueryParams, TQuestion } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import type {
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from "mongoose"
import mongoose from "mongoose"
import { redirect } from "next/navigation"

export async function getAllUsers({ params }: { params: TQueryParams }) {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = NUM_RESULTS_PER_PAGE,
      localSortQuery,
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    // build searchQuery
    const searchQuery: FilterQuery<IUserDocument> = localSearchQuery
      ? {
          $or: [
            { name: { $regex: localSearchQuery, $options: "i" } },
            { userName: { $regex: localSearchQuery, $options: "i" } },
            { location: { $regex: localSearchQuery, $options: "i" } },
            { bio: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    // build sortQuery
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

    // pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage

    // Perform query
    const users = await User.find(searchQuery)
      .populate([{ path: "savedQuestions", model: Question }])
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)

    return JSON.parse(JSON.stringify(users))
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
}): Promise<TQuestion[]> {
  try {
    // get user from from clerk DB
    const clerckUser = await currentUser()

    if (!clerckUser) {
      redirect("/sign-in")
    }

    const clerkId = clerckUser?.id

    //  connect to mongo db
    await connectToMongoDB()

    // Extract params
    const {
      page = 1,
      numOfResultsPerPage = NUM_RESULTS_PER_PAGE,
      localSortQuery = "",
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    // Query
    // Step 1: Find the User and get user's savedQuestions array
    const user = await User.findOne({ clerkId }, { savedQuestions: 1 })

    if (!user) {
      throw new Error("User not found")
    }

    // Step 2: Extract user's savedQuestions (array of IDs)
    const savedQuestionIds = user.savedQuestions as mongoose.Types.ObjectId[]

    // Step 3: Build aggregation pipeline
    const pipelineStages: PipelineStage[] = []

    // Step 4: Match the user's savedQuestions by their IDs
    pipelineStages.push({
      $match: { _id: { $in: savedQuestionIds } },
    })

    // Step 5: Match questions by localSearchQuery
    const searchQueryStage: FilterQuery<IQuestionDocument> = localSearchQuery
      ? {
          $or: [
            { title: { $regex: localSearchQuery, $options: "i" } },
            { content: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    pipelineStages.push({ $match: searchQueryStage })

    // Step 6: add numUpVotes field, computed number of upVoters
    pipelineStages.push({
      $addFields: {
        numUpVotes: { $size: "$upVoters" },
      },
    })

    // Step 7: Sort questions by localSortQuery
    let sortQueryStage: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "most_recent":
        sortQueryStage = { createdAt: -1 }
        break
      case "oldest":
        sortQueryStage = { createdAt: 1 }
        break
      case "highest_upvotes":
        sortQueryStage = { numUpVotes: -1 }
        break
      case "lowest_upvotes":
        sortQueryStage = { numUpVotes: 1 }
        break
      default:
        sortQueryStage = {
          createdAt: -1,
        }
    }

    sortQueryStage && pipelineStages.push({ $sort: sortQueryStage })

    // Step 8: Project only the necessary fields
    const projectStage = {
      _id: 1,
      title: 1,
      content: 1,
      views: 1,
      createdAt: 1,
      author: 1,
      tags: 1,
      upVoters: 1,
      downVoters: 1,
      answers: 1,
    }

    pipelineStages.push({
      $project: projectStage,
    })

    // Step 9: add pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    pipelineStages.push({ $skip: skip })
    pipelineStages.push({ $limit: limit })

    // Step 10: Perform the aggregation query with all defined pipeline stages
    const questionsAggregation = await Question.aggregate(pipelineStages).exec()

    // Step 11: Populate the necessary fields
    const populateFields = [
      { path: "author", model: User },
      { path: "tags", model: Tag },
      { path: "upVoters", model: User },
      { path: "downVoters", model: User },
      { path: "answers", model: Answer },
    ]

    const result = await Question.populate(questionsAggregation, populateFields)

    // format
    const questions = JSON.parse(JSON.stringify(result))

    return questions
  } catch (error) {
    const err = error as Error
    console.log("getCurrentUserSavedQuestions Error", err.message)
    throw new Error(`Could not fetch saved questions - ${err.message}`)
  }
}

export async function getUserQuestions({
  userId,
}: {
  userId: string
}): Promise<TQuestion[]> {
  try {
    await connectToMongoDB()

    const questionsDoc: IQuestionDocument[] = await Question.find({
      author: userId,
    })
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
      .sort({ views: -1 })

    const questions: TQuestion[] = JSON.parse(JSON.stringify(questionsDoc))

    return questions
  } catch (error) {
    const err = error as Error
    console.log("getUserQuestions Error", err.message)
    throw new Error(`Could not fetch user's questions - ${err.message}`)
  }
}

export async function getUserAnswers({
  userId,
}: {
  userId: string
}): Promise<IAnswerDocument[]> {
  try {
    await connectToMongoDB()

    const answersDoc: IAnswerDocument[] = await Answer.find(
      {
        author: userId,
      },
      { content: 1, author: 1, upVoters: 1, createdAt: 1, question: 1 }
    )
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
      .sort({ createdAt: -1 })

    return answersDoc
  } catch (error) {
    const err = error as Error
    console.log("getUserAnswers Error", err.message)
    throw new Error(`Could not fetch user's answers - ${err.message}`)
  }
}

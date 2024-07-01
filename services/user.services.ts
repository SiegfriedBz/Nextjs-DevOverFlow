"use server"

import type { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateUserInput } from "@/lib/zod/user.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User, { type IUserDocument } from "@/models/user.model"
import type { TQueryParams, TQuestion } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import type { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import { redirect } from "next/navigation"

export async function getAllUsers({ params }: { params: TQueryParams }) {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = 10,
      localFilterQuery = "",
      // globalFilterQuery = "",
    } = params

    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    const query: FilterQuery<IUserDocument> = localFilterQuery
      ? {
          $or: [
            { name: { $regex: localFilterQuery, $options: "i" } },
            { userName: { $regex: localFilterQuery, $options: "i" } },
            { location: { $regex: localFilterQuery, $options: "i" } },
            { bio: { $regex: localFilterQuery, $options: "i" } },
          ],
        }
      : {}

    const users = await User.find(query)
      .populate([{ path: "savedQuestions", model: Question }])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

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

    const {
      page = 1,
      numOfResultsPerPage = 10,
      localFilterQuery = "",
      // globalFilterQuery = "",
    } = params

    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    const query: FilterQuery<IQuestionDocument> = localFilterQuery
      ? {
          $or: [
            { title: { $regex: localFilterQuery, $options: "i" } },
            { content: { $regex: localFilterQuery, $options: "i" } },
          ],
        }
      : {}

    // get user's saved questions
    const data = await User.findOne({ clerkId }, { savedQuestions: 1 })
      .populate([
        {
          path: "savedQuestions",
          match: query as FilterQuery<IQuestionDocument>,
          model: Question,
          populate: [
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
          ],
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const savedQuestionsDoc: IUserDocument[] = data?.savedQuestions
    const savedQuestions: TQuestion[] = JSON.parse(
      JSON.stringify(savedQuestionsDoc)
    )

    return savedQuestions
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

"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { IQuestionDocument } from "@/models/question.model"
import Question from "@/models/question.model"
import Tag, { type ITagDocument } from "@/models/tag.model"
import User from "@/models/user.model"
import { getUser } from "@/services/user.services"
import type { TQueryParams, TQuestion, TTag } from "@/types"
import type { FilterQuery, UpdateQuery } from "mongoose"

export async function getHotTags({
  limit,
}: {
  limit: number
}): Promise<{ _id: string; name: string }[]> {
  try {
    await connectToMongoDB()

    const result = await Tag.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          questionsCount: { $size: "$questions" },
          followersCount: { $size: "$followers" },
        },
      },
      {
        $sort: { questionsCount: -1, followersCount: -1 },
      },
      {
        $limit: limit,
      },
    ])

    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    const err = error as Error
    console.log("getHotTags Error", err.message)
    throw new Error(`Could not fetch hot tags - ${err.message}`)
  }
}

export async function getAllTags({
  maxPageSize = 1000,
  params,
}: {
  maxPageSize?: number
  params: TQueryParams
}): Promise<{
  tags: TTag[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1, searchQueryParam = "", sortQueryParam = "" } = params

    await connectToMongoDB()

    // Build searchQuery on Tag
    const searchQuery: FilterQuery<ITagDocument> = {}

    if (searchQueryParam) {
      searchQuery.$or = [
        {
          name: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
        {
          description: {
            $regex: new RegExp(searchQueryParam, "i"),
          },
        },
      ]
    }

    // Build sortQuery on Tag
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (sortQueryParam) {
      case "name":
        sortQuery = { name: 1 }
        break
      case "old":
        sortQuery = { createdAt: 1 }
        break
      case "recent":
        sortQuery = { createdAt: -1 }
        break
      case "popular":
        sortQuery = { questions: -1 }
        break
      default:
        sortQuery = { createdAt: -1 }
    }

    // Pagination
    const limit = maxPageSize
    const skip = (page - 1) * maxPageSize

    // Perform query
    const result = await Tag.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)

    // Pagination data
    const totalDocs = await Tag.countDocuments(searchQuery)
    const hasNextPage = totalDocs > skip + result?.length

    // format
    const tags = JSON.parse(JSON.stringify(result))

    return { tags, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getAllTags Error", err.message)
    throw new Error(`Could not fetch tags - ${err.message}`)
  }
}

export async function getTag({
  filter,
}: {
  filter: FilterQuery<ITagDocument>
}): Promise<TTag> {
  try {
    const result: ITagDocument | null = await Tag.findOne(filter)

    if (!result) {
      throw new Error(`Tag not found`)
    }

    const tag: TTag = JSON.parse(JSON.stringify(result))

    return tag
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(`Could not fetch tag - ${err.message}`)
  }
}

export async function updateManyTags({
  filter,
  data,
}: {
  filter: FilterQuery<ITagDocument>
  data: UpdateQuery<ITagDocument> | undefined
}) {
  try {
    await connectToMongoDB()
    const result = await Tag.updateMany(filter, data)

    return result
  } catch (error) {
    const err = error as Error
    console.log("updateManyTags", err.message)
    throw new Error(`Could not update tags - ${err.message}`)
  }
}

export async function getQuestionsByTag({
  maxPageSize = 1000,
  filter,
  params,
}: {
  maxPageSize?: number
  filter: FilterQuery<ITagDocument>
  params: TQueryParams
}): Promise<{
  questions: TQuestion[]
  hasNextPage: boolean
}> {
  try {
    const { page = 1, searchQueryParam = "", sortQueryParam } = params

    await connectToMongoDB()

    // Build searchQuery on Question
    const searchQuery: FilterQuery<IQuestionDocument> = {}

    if (searchQueryParam) {
      searchQuery.$or = [
        { title: { $regex: new RegExp(searchQueryParam, "i") } },
        { content: { $regex: new RegExp(searchQueryParam, "i") } },
      ]
    }

    // Build sortQuery on Question
    let sortQuery: Record<string, 1 | -1> | undefined
    switch (sortQueryParam) {
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
    const limit = maxPageSize
    const skip = (page - 1) * maxPageSize

    // Perform query
    const result: ITagDocument | null = await Tag.findOne(filter, {
      questions: 1,
    }).populate({
      path: "questions",
      model: Question,
      match: searchQuery as FilterQuery<IQuestionDocument>,
      options: {
        skip,
        limit: limit + 1, // for pagination, fetch and include next page (+1 result)
        sort: sortQuery, // sort questions
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    })

    if (!result) {
      throw new Error("Tag not found")
    }

    // Extract questions
    const questionsDoc = result.questions

    // Pagination data
    const hasNextPage = result.questions.length > maxPageSize

    // format
    const questions = JSON.parse(JSON.stringify(questionsDoc))

    return { questions, hasNextPage }
  } catch (error) {
    const err = error as Error
    console.log("getQuestionsByTag", err.message)
    throw new Error(`Could not get questions by tag - ${err.message}`)
  }
}

//  TODO
export async function getUserTopTags({
  userId,
  limit = 3,
}: {
  userId: string
  limit: number
}) {
  try {
    await connectToMongoDB()

    // get user
    const result = await getUser({ filter: { _id: userId } })

    if (!result) {
      throw new Error("User not found")
    }

    // get user tags
    return result
  } catch (error) {
    const err = error as Error
    console.log("getUserTopTags Error", err.message)
    throw new Error(`Could not fetch user's tags - ${err.message}`)
  }
}

export async function upsertTagsOnMutateQuestion({
  question,
  tags,
}: {
  question: IQuestionDocument
  tags: string[] // tagNames
}) {
  try {
    await connectToMongoDB()

    const uniqueTags = new Set([...tags])

    let tagsIds: ITagDocument["_id"][] = []
    for (const tagName of uniqueTags) {
      const result = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
        {
          $setOnInsert: { name: tagName },
          $push: {
            questions: (question as IQuestionDocument)._id,
          },
        },
        { upsert: true, new: true }
      )

      tagsIds = [...tagsIds, result._id]
    }

    return tagsIds
  } catch (error) {
    const err = error as Error
    console.log("upsertTagsOnMutateQuestion Error", err.message)
    throw new Error(`Could not upsert tags - ${err.message}`)
  }
}

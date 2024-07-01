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

export async function getAllTags({ params }: { params: TQueryParams }) {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = 10,
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    const query: FilterQuery<ITagDocument> = localSearchQuery
      ? {
          $or: [
            { name: { $regex: localSearchQuery, $options: "i" } },
            { description: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    const result = await Tag.find(query)
      .populate([{ path: "questions", model: Question }])
      .populate([{ path: "followers", model: User }])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const tags = JSON.parse(JSON.stringify(result))

    return tags
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
  filter,
  params,
}: {
  filter: FilterQuery<ITagDocument>
  params: TQueryParams
}): Promise<TQuestion[]> {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = 10,
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    const query: FilterQuery<IQuestionDocument> = localSearchQuery
      ? {
          $or: [
            { title: { $regex: localSearchQuery, $options: "i" } },
            { content: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    const result: ITagDocument | null = await Tag.findOne(filter, {
      questions: 1,
    })
      .populate({
        path: "questions",
        model: Question,
        match: query as FilterQuery<IQuestionDocument>,
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
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    if (!result) {
      throw new Error("Tag not found")
    }

    const questionsDoc = result.questions

    const questions = JSON.parse(JSON.stringify(questionsDoc))

    return questions
  } catch (error) {
    const err = error as Error
    console.log("getQuestionsByTag", err.message)
    throw new Error(`Could not get questions by tag - ${err.message}`)
  }
}

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

    // TODO
    return [
      {
        _id: "1",
        name: "Stuff",
        questions: ["kkv", "kjgl"],
        description: "jblgvlvlv",
        followers: ["kkv", "kjgl"],
      },
      {
        _id: "2",
        name: "Stuff 2",
        questions: ["kkv", "kjgl"],
        description: "jblgvlvlv",
        followers: ["kkv", "kjgl"],
      },
      {
        _id: "3",
        name: "Stuff 3",
        questions: ["kkv", "kjgl"],
        description: "jblgvlvlv",
        followers: ["kkv", "kjgl"],
      },
    ]
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

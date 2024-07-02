"use server"

import { NUM_RESULTS_PER_PAGE } from "@/constants"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { IQuestionDocument } from "@/models/question.model"
import Question from "@/models/question.model"
import Tag, { type ITagDocument } from "@/models/tag.model"
import User from "@/models/user.model"
import { getUser } from "@/services/user.services"
import type { TQueryParams, TQuestion, TTag } from "@/types"
import type { FilterQuery, PipelineStage, UpdateQuery } from "mongoose"

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
      numOfResultsPerPage = NUM_RESULTS_PER_PAGE,
      localSortQuery = "",
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    // Step 1: Build aggregation pipeline
    const pipelineStages: PipelineStage[] = []

    // Step 2: Match questions by localSearchQuery
    const searchQueryStage: FilterQuery<ITagDocument> = localSearchQuery
      ? {
          $or: [
            { name: { $regex: localSearchQuery, $options: "i" } },
            { description: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}
    pipelineStages.push({ $match: searchQueryStage })

    // Step 3: Add numQuestions field
    pipelineStages.push({
      $addFields: {
        numQuestions: { $size: "$questions" }, // Compute number of answers
      },
    })

    // Step 4: Conditionally sort Tags
    let sortQueryStage: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "name":
        sortQueryStage = { name: 1 }
        break
      case "popular":
        sortQueryStage = { numQuestions: -1 }
        break
      case "old":
        sortQueryStage = { createdAt: 1 }
        break
      case "recent":
        sortQueryStage = { createdAt: -1 }
        break
      default:
        sortQueryStage = { createdAt: -1 } // Default to sorting by createdAt in descending order (newest first)
    }

    sortQueryStage && pipelineStages.push({ $sort: sortQueryStage })

    // Step 5: Add necessary fields
    const projectStage = {
      _id: 1,
      name: 1,
      description: 1,
      questions: 1,
      followers: 1,
      createdAt: 1,
    }

    pipelineStages.push({
      $project: projectStage,
    })

    // Step 6: add pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    pipelineStages.push({ $skip: skip })
    pipelineStages.push({ $limit: limit })

    // Step 7: Perform the aggregation query
    const tagsAggregation = await Tag.aggregate(pipelineStages).exec()

    // Step 8: Populate
    const populateFields = [
      { path: "questions", model: Question },
      { path: "followers", model: User },
    ]

    const result = await Question.populate(tagsAggregation, populateFields)

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
      numOfResultsPerPage = NUM_RESULTS_PER_PAGE,
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    // Build search query
    const query: FilterQuery<IQuestionDocument> = localSearchQuery
      ? {
          $or: [
            { title: { $regex: localSearchQuery, $options: "i" } },
            { content: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    // Add pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage

    // Perform query
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

    // Extract questions
    const questionsDoc = result.questions

    // Format
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

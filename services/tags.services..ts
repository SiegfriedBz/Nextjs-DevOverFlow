"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { IQuestionDocument } from "@/models/question.model"
import Question from "@/models/question.model"
import Tag, { type ITagDocument } from "@/models/tag.model"
import User from "@/models/user.model"
import type { TTag } from "@/types"
import type { FilterQuery, QueryOptions } from "mongoose"
import { getUser } from "./user.services"

export async function getAllTags({
  searchParams,
  options = {},
}: {
  searchParams?: { [key: string]: string | undefined }
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    await connectToMongoDB()

    // TODO
    // HANDLE searchParams
    // const {
    //   page = 1,
    //   numOfResultsPerPage = 10,
    //   filter = "",
    //   searchQuery = "",
    // } = searchParams

    const tags = await Tag.find({})
      .populate([{ path: "questions", model: Question }])
      .populate([{ path: "followers", model: User }])
      .sort({ createdAt: -1 })
    // .lean()

    return JSON.parse(JSON.stringify(tags))
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
}): Promise<TTag | null> {
  try {
    await connectToMongoDB()

    const tagDocument: ITagDocument | null = await Tag.findOne(filter).populate(
      [
        {
          path: "followers",
          model: User,
          select: "_id clerkId name picture",
        },
        { path: "questions", model: Question },
      ]
    )

    const tag: TTag = JSON.parse(JSON.stringify(tagDocument))

    if (!tag?._id) {
      throw new Error(`Tag not found`)
    }

    return tag
  } catch (error) {
    const err = error as Error
    console.log("getQuestion getTag", err.message)
    throw new Error(`Could not fetch tag - ${err.message}`)
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
    const user = await getUser({ filter: { _id: userId } })

    if (!user) {
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

export async function upsertTagsOnCreateQuestion({
  newQuestion,
  tags,
}: {
  newQuestion: IQuestionDocument
  tags: string[]
}) {
  try {
    await connectToMongoDB()

    let tagsIds: ITagDocument["_id"][] = []

    for (const tagName of tags) {
      const upsertedTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
        {
          $setOnInsert: { name: tagName },
          $push: { questions: (newQuestion as IQuestionDocument)._id },
        },
        { upsert: true, new: true }
      )

      tagsIds = [...tagsIds, upsertedTag._id]
    }

    return tagsIds
  } catch (error) {
    const err = error as Error
    console.log("upsertTagsOnCreateQuestion Error", err.message)
    throw new Error(`Could not upsert tags - ${err.message}`)
  }
}

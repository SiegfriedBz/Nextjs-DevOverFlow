"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { IQuestionDocument } from "@/models/question.model"
import Tag, { type ITagDocument } from "@/models/tag.model"
import { getUser } from "./user.services"

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
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ]
  } catch (error) {
    const err = error as Error
    console.log("getUserTopTags Error", err.message)
    throw new Error(
      `Something went wrong when getting user's tags - ${err.message}`
    )
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
          $push: { question: (newQuestion as IQuestionDocument)._id },
        },
        { upsert: true, new: true }
      )

      tagsIds = [...tagsIds, upsertedTag._id]
    }

    return tagsIds
  } catch (error) {
    const err = error as Error
    console.log("upsertTagsOnCreateQuestion Error", err.message)
    throw new Error(
      `Something went wrong when creating/updating the tags - ${err.message}`
    )
  }
}

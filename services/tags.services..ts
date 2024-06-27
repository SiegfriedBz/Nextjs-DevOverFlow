import connectToMongoDB from "@/lib/mongoose.utils"
import { IQuestionDocument } from "@/models/question.model"
import Tag, { type ITagDocument } from "@/models/tag.model"

export async function upsertTagsOnCreateQuestion({
  newQuestion,
  tags,
}: {
  newQuestion: IQuestionDocument
  tags: string[]
}) {
  await connectToMongoDB()

  let tagsIds: ITagDocument["_id"][] = []

  try {
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

import connectToMongoDB from "@/lib/mongoose.utils"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import { FilterQuery } from "mongoose"

export async function findAndDeleteManyAnswers({
  filter,
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Answer.deleteMany(filter)

    // if (!result.deletedCount) {
    //   throw new Error(`No answers found for the given filter`)
    // }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== findAndDeleteManyAnswers Error", err)
    throw new Error(
      `Something went wrong when deleting answers - ${err.message}`
    )
  }
}

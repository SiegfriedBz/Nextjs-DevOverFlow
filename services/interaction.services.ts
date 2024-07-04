"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import Interaction, {
  type IInteractionDocument,
} from "@/models/interaction.model"
import { FilterQuery } from "mongoose"

export async function getInteraction({
  filter,
}: {
  filter: FilterQuery<IInteractionDocument>
}): Promise<IInteractionDocument | null> {
  try {
    await connectToMongoDB()

    const interaction: IInteractionDocument | null =
      await Interaction.findOne(filter)

    // we do not throw

    return JSON.parse(JSON.stringify(interaction))
  } catch (error) {
    const err = error as Error
    console.log("getInteraction Error", err.message)
    throw new Error(`Could not get interaction - ${err.message}`)
  }
}

export async function createInteraction({
  data,
}: {
  data: Partial<IInteractionDocument>
}) {
  try {
    await connectToMongoDB()

    const newInteraction = await Interaction.create(data)

    return newInteraction
  } catch (error) {
    const err = error as Error
    console.log("===== createInteraction Error", err)
    throw new Error(`Could not create interaction - ${err.message}`)
  }
}

export async function deleteManyInteractions({
  filter,
}: {
  filter: FilterQuery<IInteractionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Interaction.deleteMany(filter)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteManyInteractions Error", err)
    throw new Error(`Could not delete interactions - ${err.message}`)
  }
}

"use server"

import type { IAnswerDocument } from "@/models/answer.model"
import type { IInteractionDocument } from "@/models/interaction.model"
import type { IQuestionDocument } from "@/models/question.model"
import { findAndUpdateAnswer } from "@/services/answer.services"
import {
  createInteraction,
  getInteraction,
} from "@/services/interaction.services"
import { findAndUpdateQuestion } from "@/services/question.services"
import { getUser } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"

// create an interaction record with actionType "view" for a question | answer
export async function createViewForAction({
  viewFor,
  questionId,
  answerId,
}:
  | { viewFor: "question"; questionId: string; answerId?: undefined }
  | { viewFor: "answer"; questionId?: undefined; answerId: string }) {
  try {
    // Get clerk user
    const user = await currentUser()
    if (!user)
      return console.log("user required to create new interaction record")

    // Get mongoUser
    const mongoUser = await getUser({ filter: { clerkId: user.id } })
    if (!mongoUser)
      return console.log("user required to create new interaction record")

    // create new interaction if not exist
    let interaction: IInteractionDocument | null = null

    // case question view interaction
    let updatedQuestion: IQuestionDocument | null = null
    if (viewFor === "question") {
      // check if interaction already exists
      const interactionExists = await getInteraction({
        filter: {
          user: mongoUser._id as IInteractionDocument["user"],
          actionType: "view",
          question: questionId as unknown as IInteractionDocument["question"],
        },
      })

      if (interactionExists) return console.log("interaction already exists")

      // update question total views
      updatedQuestion = await findAndUpdateQuestion({
        filter: { _id: questionId },
        data: { $inc: { views: 1 } },
      })

      if (!updatedQuestion) {
        throw new Error("Could not update question")
      }

      // create question view interaction
      interaction = await createInteraction({
        data: {
          user: mongoUser._id as IInteractionDocument["user"],
          actionType: "view",
          question: updatedQuestion._id as IInteractionDocument["question"],
        },
      })
    }

    // case answer view interaction
    let updatedAnswer: IAnswerDocument | null = null
    if (viewFor === "answer") {
      // check if interaction already exists
      const interactionExists = await getInteraction({
        filter: {
          user: mongoUser._id as IInteractionDocument["user"],
          actionType: "view",
          answer: answerId as unknown as IInteractionDocument["answer"],
        },
      })

      if (interactionExists) return console.log("interaction already exists")

      // update answer total views
      updatedAnswer = await findAndUpdateAnswer({
        filter: { _id: answerId },
        data: { $inc: { views: 1 } },
      })

      if (!updatedAnswer) {
        throw new Error("Could not update answer")
      }

      // create answer view interaction
      interaction = await createInteraction({
        data: {
          user: mongoUser._id as IInteractionDocument["user"],
          actionType: "view",
          answer: updatedAnswer._id as IInteractionDocument["answer"],
        },
      })
    }

    return JSON.parse(JSON.stringify(interaction))
  } catch (error) {
    const err = error as Error
    console.log("===== createView Error", err)
    throw new Error(`Could not create a View - ${err.message}`)
  }
}

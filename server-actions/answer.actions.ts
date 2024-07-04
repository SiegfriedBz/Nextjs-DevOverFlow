"use server"

import { mutateAnswerSchema, TMutateAnswerInput } from "@/lib/zod/answer.zod"
import { IQuestionDocument } from "@/models/question.model"
import { IUserDocument } from "@/models/user.model"
import {
  createAnswer,
  deleteAnswer,
  updateAnswer,
} from "@/services/answer.services"
import {
  createInteraction,
  deleteManyInteractions,
} from "@/services/interaction.services"
import {
  updateManyQuestions,
  updateQuestion,
} from "@/services/question.services"
import { updateUser, getUser } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
import mongoose from "mongoose"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAnswerAction({
  data,
}: {
  data: TMutateAnswerInput
}) {
  try {
    // zod validation
    const parsedData = mutateAnswerSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Invalid input data")
    }

    // get user from from clerk DB
    const clerckUser = await currentUser()

    if (!clerckUser) {
      redirect("/sign-in")
    }

    const userEmail = clerckUser?.emailAddresses?.at(0)?.emailAddress as string

    // get user from our DB
    const author = await getUser({ filter: { email: userEmail } })

    // create answer
    const newAnswer = await createAnswer({
      data: {
        ...parsedData.data,
        author: author?._id as IQuestionDocument["author"],
      },
    })

    // update question with newAnswer
    const questionId = parsedData.data.question
    const updatedQuestion = await updateQuestion({
      filter: { _id: questionId },
      data: { $push: { answers: newAnswer._id } },
    })

    if (!updatedQuestion) {
      throw new Error("Could not update question")
    }

    // create user interaction
    await createInteraction({
      data: {
        user: author?._id as mongoose.Schema.Types.ObjectId,
        actionType: "answer",
        answer: newAnswer._id as mongoose.Schema.Types.ObjectId,
        question: updatedQuestion._id as mongoose.Schema.Types.ObjectId,
        tags: updatedQuestion.tags,
      },
    })

    // update user's reputation
    await updateUser({
      filter: { _id: (author as IUserDocument)._id },
      data: { $inc: { reputation: 10 } },
    })

    // revalidate
    revalidatePath(`/questions/${questionId}`)

    return JSON.parse(JSON.stringify(newAnswer))
  } catch (error) {
    console.log("===== createAnswerAction Error", error)
    return error
  }
}

export async function deleteAnswerAction({ _id }: { _id: string }) {
  try {
    const answerId = _id

    //  delete answer
    await deleteAnswer({
      filter: { _id: answerId },
    })

    // remove answer from all associated questions
    await updateManyQuestions({
      filter: { answers: answerId },
      data: {
        $pull: { answers: answerId },
      },
    })

    // delete associated interactions
    await deleteManyInteractions({ filter: { answer: answerId } })

    // revalidate
    revalidatePath("/")
  } catch (error) {
    console.log("===== deleteAnswerAction Error", error)
    return error
  }
}

export async function voteAnswerAction({
  answerId,
  voterId,
  isUpVoting,
}: {
  answerId: string
  voterId: string
  isUpVoting: boolean
}) {
  try {
    const query = isUpVoting
      ? { $push: { upVoters: voterId }, $pull: { downVoters: voterId } }
      : { $pull: { upVoters: voterId }, $push: { downVoters: voterId } }

    const updatedAnswer = await updateAnswer({
      filter: { _id: answerId },
      data: query,
    })

    // update user's reputation
    await updateUser({
      filter: { _id: voterId },
      data: {
        $inc: { reputation: isUpVoting ? 1 : -1 },
      },
    })

    // update answer's author reputation
    await updateUser({
      filter: { _id: updatedAnswer?.author },
      data: {
        $inc: { reputation: isUpVoting ? 10 : -10 },
      },
    })

    // revalidate
    revalidatePath("/questions/")

    return JSON.parse(JSON.stringify(updatedAnswer))
  } catch (error) {
    console.log("===== voteAnswerAction Error", error)
    return error
  }
}

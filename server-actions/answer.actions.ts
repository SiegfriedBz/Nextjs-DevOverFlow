"use server"

import { mutateAnswerSchema, TMutateAnswerInput } from "@/lib/zod/answer.zod"
import { IQuestionDocument } from "@/models/question.model"
import { IUserDocument } from "@/models/user.model"
import { createAnswer, findAndUpdateAnswer } from "@/services/answer.services"
import { findAndUpdateQuestion } from "@/services/question.services"
import { findAndUpdateUser, getUser } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
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

    // get user from cleck DB
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
    await findAndUpdateQuestion({
      filter: { _id: questionId },
      data: { $push: { answers: newAnswer._id } },
    })

    // update user's reputation
    await findAndUpdateUser({
      filter: { _id: (author as IUserDocument)._id },
      data: { reputation: (author as IUserDocument).reputation + 5 },
    })

    // revalidate
    revalidatePath(`/questions/${questionId}`)

    return JSON.parse(JSON.stringify(newAnswer))
  } catch (error) {
    console.log(error)
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
      ? { $push: { upVoters: voterId } }
      : { $push: { downVoters: voterId } }

    const updatedAnswer = await findAndUpdateAnswer({
      filter: { _id: answerId },
      data: query,
    })

    // revalidate
    revalidatePath("/")

    return JSON.parse(JSON.stringify(updatedAnswer))
  } catch (error) {
    console.log(error)
    return error
  }
}

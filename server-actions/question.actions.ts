"use server"

import {
  mutateQuestionSchema,
  type TMutateQuestionInput,
} from "@/lib/zod/question.zod"
import type { IQuestionDocument } from "@/models/question.model"
import type { IUserDocument } from "@/models/user.model"
import {
  createQuestion,
  findAndUpdateQuestion,
} from "@/services/question.services"
import { upsertTagsOnCreateQuestion } from "@/services/tags.services."
import { findAndUpdateUser, getUser } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createQuestionAction({
  data,
}: {
  data: TMutateQuestionInput
}) {
  try {
    // zod validation
    const parsedData = mutateQuestionSchema.safeParse(data)
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

    // create question without tags
    const { title, content, tags } = parsedData.data
    const newQuestion = await createQuestion({
      data: {
        author: author?._id as IQuestionDocument["author"],
        title,
        content,
      },
    })

    // get tags or create them if do not exist
    const tagsIds = await upsertTagsOnCreateQuestion({
      newQuestion: newQuestion as IQuestionDocument,
      tags,
    })

    // update newQuestion with tagsIds
    const updatedQuestion = await findAndUpdateQuestion({
      filter: { _id: newQuestion?._id },
      data: { $push: { tags: { $each: tagsIds } } },
    })

    // update user's reputation
    await findAndUpdateUser({
      filter: { _id: (author as IUserDocument)._id },
      data: { reputation: (author as IUserDocument).reputation + 5 },
    })

    // revalidate
    revalidatePath("/")

    return JSON.parse(JSON.stringify(updatedQuestion))
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function updateQuestionAction({
  questionId,
  data,
}: {
  questionId: string
  data: TMutateQuestionInput
}) {
  try {
    const parsedData = mutateQuestionSchema.safeParse(data)

    if (!parsedData.success) {
      throw new Error("Invalid input data")
    }

    const updatedQuestion = await findAndUpdateQuestion({
      filter: { _id: questionId },
      data: parsedData.data,
    })

    // revalidate
    revalidatePath("/")

    return JSON.parse(JSON.stringify(updatedQuestion))
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function voteQuestionAction({
  questionId,
  voterId,
  isUpVoting,
}: {
  questionId: string
  voterId: string
  isUpVoting: boolean
}) {
  try {
    const query = isUpVoting
      ? { $push: { upVoters: voterId } }
      : { $push: { downVoters: voterId } }

    const updatedQuestion = await findAndUpdateQuestion({
      filter: { _id: questionId },
      data: query,
    })

    // revalidate
    revalidatePath("/")

    return JSON.parse(JSON.stringify(updatedQuestion))
  } catch (error) {
    console.log(error)
    return error
  }
}

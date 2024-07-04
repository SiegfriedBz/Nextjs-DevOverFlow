"use server"

import {
  mutateQuestionSchema,
  type TMutateQuestionInput,
} from "@/lib/zod/question.zod"
import type { IQuestionDocument } from "@/models/question.model"
import type { IUserDocument } from "@/models/user.model"
import { deleteManyAnswers } from "@/services/answer.services"
import {
  createInteraction,
  deleteManyInteractions,
} from "@/services/interaction.services"
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
} from "@/services/question.services"
import {
  updateManyTags,
  upsertTagsOnMutateQuestion,
} from "@/services/tags.services."
import { getUser, updateUser } from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
import mongoose from "mongoose"
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

    // get user from from clerk DB
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

    if (!newQuestion) {
      throw new Error("Could not create question")
    }

    // get tags or create them if do not exist
    const tagsIds = await upsertTagsOnMutateQuestion({
      question: newQuestion as IQuestionDocument,
      tags, // tags are tagNames
    })

    // update newQuestion with tagsIds
    const updatedQuestion = await updateQuestion({
      filter: { _id: newQuestion?._id },
      data: { $push: { tags: { $each: tagsIds } } },
    })

    // create user interaction
    await createInteraction({
      data: {
        user: author?._id as mongoose.Schema.Types.ObjectId,
        actionType: "ask_question",
        question: newQuestion._id as mongoose.Schema.Types.ObjectId,
        tags: tagsIds as mongoose.Schema.Types.ObjectId[],
      },
    })

    // update user's reputation
    await updateUser({
      filter: { _id: (author as IUserDocument)._id },
      data: { $inc: { reputation: 5 } },
    })

    // revalidate
    revalidatePath("/")

    return JSON.parse(JSON.stringify(updatedQuestion))
  } catch (error) {
    console.log("===== createQuestionAction Error", error)
    return error
  }
}

// note: does not allow to update tags
export async function updateQuestionAction({
  questionId,
  data,
}: {
  questionId: string
  data: TMutateQuestionInput
}) {
  try {
    console.log("updateQuestionAction -> questionId", questionId)
    console.log("updateQuestionAction -> data", data)

    const parsedData = mutateQuestionSchema.safeParse(data)

    if (!parsedData.success) {
      throw new Error("Invalid input data")
    }

    // get user from from clerk DB
    const currentClerckUser = await currentUser()
    if (!currentClerckUser) {
      redirect("/sign-in")
    }

    // get question
    const question = await getQuestion({ filter: { _id: questionId } })
    const questionAuthor = JSON.parse(JSON.stringify(question?.author))

    // check if current user is question author
    const isAuthor = currentClerckUser?.id === questionAuthor.clerkId
    if (!isAuthor) {
      throw new Error("Only author can edit question")
    }

    // update question without tags
    const result = await updateQuestion({
      filter: { _id: questionId },
      data: {
        title: parsedData.data.title,
        content: parsedData.data.content,
      },
    })

    // revalidate
    revalidatePath("/")

    const updatedQuestion = JSON.parse(JSON.stringify(result))
    console.log("updateQuestionAction -> updatedQuestion", updatedQuestion)

    return updatedQuestion
  } catch (error) {
    console.log("===== updateQuestionAction Error", error)
    return error
  }
}

export async function deleteQuestionAction({ _id }: { _id: string }) {
  try {
    const questionId = _id

    // delete question
    await deleteQuestion({
      filter: { _id: questionId },
    })

    // delete associated answers
    await deleteManyAnswers({ filter: { question: questionId } })

    // delete associated interactions
    await deleteManyInteractions({ filter: { question: questionId } })

    // delete question in tags
    await updateManyTags({
      filter: { questions: questionId },
      data: { $pull: { questions: questionId } },
    })

    // revalidate
    revalidatePath("/")
  } catch (error) {
    console.log("===== deleteQuestionAction Error", error)
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
      ? { $push: { upVoters: voterId }, $pull: { downVoters: voterId } }
      : { $pull: { upVoters: voterId }, $push: { downVoters: voterId } }

    const updatedQuestion = await updateQuestion({
      filter: { _id: questionId },
      data: query,
    })

    // update user's reputation
    await updateUser({
      filter: { _id: voterId },
      data: {
        $inc: { reputation: isUpVoting ? 1 : -1 },
      },
    })

    // update question's author reputation
    await updateUser({
      filter: { _id: updatedQuestion?.author },
      data: {
        $inc: { reputation: isUpVoting ? 10 : -10 },
      },
    })

    // revalidate
    revalidatePath(`/questions/${questionId}`)
  } catch (error) {
    console.log("===== voteQuestionAction Error", error)
    return error
  }
}

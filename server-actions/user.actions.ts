"use server"

import type { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import { IUserDocument } from "@/models/user.model"
import { deleteManyAnswers } from "@/services/answer.services"
import { deleteManyQuestions } from "@/services/question.services"
import {
  createUser,
  deleteUser,
  updateUser,
  getUser,
} from "@/services/user.services"
import { currentUser } from "@clerk/nextjs/server"
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createUserAction({
  userData,
}: {
  userData: TMutateUserData
}) {
  try {
    // create user in our DB from ClerkUser
    const newUser: IUserDocument | null = await createUser(userData)

    revalidatePath(`/profile/${(newUser as IUserDocument).clerkId}`)

    return newUser
  } catch (error) {
    console.log("===== createUserAction Error", error)
    return error
  }
}

export async function updateUserAction({
  filter,
  data,
  options = {},
}: {
  filter: FilterQuery<IUserDocument>
  data: UpdateQuery<IUserDocument>
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    const updatedUserDoc: IUserDocument | null = await updateUser({
      filter,
      data,
      options,
    })

    revalidatePath(`/profile/${(updatedUserDoc as IUserDocument).clerkId}`)

    const updatedUser = JSON.parse(JSON.stringify(updatedUserDoc))

    return updatedUser
  } catch (error) {
    console.log("===== updateUserAction Error", error)
    return error
  }
}

export async function deleteUserAction({
  filter,
  options = {},
}: {
  filter: FilterQuery<IUserDocument>
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    // get user from mongodb
    const user = await getUser({ filter })
    if (!user?._id) {
      throw new Error("User not found")
    }

    // delete user in mongodb
    const result = await deleteUser({
      filter,
      options,
    })

    // TODO
    // delete user questions, answers...
    await deleteManyQuestions({ filter: { author: user._id } })
    await deleteManyAnswers({ filter: { author: user._id } })

    // revalidatePath(`/profile/${(updatedUser as IUserDocument).clerkId}`)

    return result
  } catch (error) {
    console.log("===== deleteUserAction Error", error)
    return error
  }
}

export async function toggleSaveQuestionAction({
  questionId,
}: {
  questionId: string
}) {
  try {
    // get user from from clerk DB
    const clerckUser = await currentUser()

    if (!clerckUser) {
      redirect("/sign-in")
    }

    const clerkId = clerckUser?.id

    // get user from our DB
    const mongoUser: IUserDocument = await getUser({ filter: { clerkId } })
    const user = JSON.parse(JSON.stringify(mongoUser))
    // check if question is already saved
    const questionIsSaved = (user.savedQuestions as string[]).some(
      (q) => q === questionId
    )

    // update user
    const query = questionIsSaved
      ? { $pull: { savedQuestions: questionId } }
      : { $push: { savedQuestions: questionId } }

    const updatedUserDoc = await updateUser({
      filter: { _id: user._id },
      data: query,
    })

    const updatedUser = JSON.parse(JSON.stringify(updatedUserDoc))

    revalidatePath("/")

    return updatedUser
  } catch (error) {
    console.log("===== toggleSaveQuestionAction Error", error)
    return error
  }
}

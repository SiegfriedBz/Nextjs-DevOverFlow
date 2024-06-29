"use server"

import type { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import { IUserDocument } from "@/models/user.model"
import { findAndDeleteManyAnswers } from "@/services/answer.services"
import { findAndDeleteManyQuestions } from "@/services/question.services"
import {
  createUser,
  findAndDeleteUser,
  findAndUpdateUser,
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

    revalidatePath(`/profile/${(newUser as IUserDocument)._id}`)

    return newUser
  } catch (error) {
    console.log(error)
    const err = error as Error
    return err
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
    const updatedUserDoc: IUserDocument | null = await findAndUpdateUser({
      filter,
      data,
      options,
    })

    revalidatePath(`/profile/${(updatedUserDoc as IUserDocument)._id}`)

    const updatedUser = JSON.parse(JSON.stringify(updatedUserDoc))

    return updatedUser
  } catch (error) {
    console.log(error)
    const err = error as Error
    return err
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
    const result = await findAndDeleteUser({
      filter,
      options,
    })

    // TODO
    // delete user questions, answers...
    await findAndDeleteManyQuestions({ filter: { author: user._id } })
    await findAndDeleteManyAnswers({ filter: { author: user._id } })

    // revalidatePath(`/profile/${(updatedUser as IUserDocument)._id}`)

    return result
  } catch (error) {
    console.log(error)
    const err = error as Error
    return err
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

    console.log("=============")
    console.log("toggleSaveQuestionAction -> clerckUser", clerckUser)
    console.log("toggleSaveQuestionAction -> user", user)
    console.log("toggleSaveQuestionAction -> questionIsSaved", questionIsSaved)

    // update user
    const query = questionIsSaved
      ? { $pull: { savedQuestions: questionId } }
      : { $push: { savedQuestions: questionId } }

    const updatedUserDoc = await findAndUpdateUser({
      filter: { _id: user._id },
      data: query,
    })

    const updatedUser = JSON.parse(JSON.stringify(updatedUserDoc))
    console.log("toggleSaveQuestionAction -> updatedUser", updatedUser)
    console.log("=============")

    revalidatePath("/")

    return updatedUser
  } catch (error) {
    console.log(error)
    const err = error as Error
    return err
  }
}

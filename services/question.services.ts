"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateQuestionInput } from "@/lib/zod/question.zod"
import Answer from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User, { IUserDocument } from "@/models/user.model"
import type { TQuestion, TSearchParamsProps } from "@/types"
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getAllQuestions({ searchParams }: TSearchParamsProps) {
  try {
    await connectToMongoDB()

    // TODO
    // HANDLE searchParams
    // const {
    //   page = 1,
    //   numOfResultsPerPage = 10,
    //   filter = "",
    //   searchQuery = "",
    // } = searchParams

    const questions = await Question.find({})
      .populate([
        { path: "author", model: User },
        { path: "tags", model: Tag },
        { path: "upVoters", model: User },
        { path: "downVoters", model: User },
        { path: "answers", model: Answer },
      ])
      .sort({ createdAt: -1 })
    // .lean()

    return JSON.parse(JSON.stringify(questions))
  } catch (error) {
    const err = error as Error
    console.log("getAllQuestions Error", err.message)
    throw new Error(
      `Something went wrong when fetching questions - ${err.message}`
    )
  }
}

export async function getQuestion({
  filter,
}: {
  filter: FilterQuery<IUserDocument>
}): Promise<TQuestion> {
  try {
    const questionDocument: IQuestionDocument | null = await Question.findOne(
      filter
    ).populate([
      { path: "author", model: User, select: "_id clerkId name picture" },
      { path: "tags", model: Tag, select: "_id name" },
      // We do not populate the upVoters, downVoters.
      // { path: "upVoters", model: User },
      // { path: "downVoters", model: User },
      // We do not populate the answers.
      // Instead, in the QuestionDetailsPage, we use getAllAnswers service to which we can pass searchParams.
      // {
      //   path: "answers",
      //   model: Answer,
      //   populate: {
      //     path: "author",
      //     model: User,
      //   },
      // },
    ])

    const question: TQuestion = JSON.parse(JSON.stringify(questionDocument))

    if (!question?._id) {
      throw new Error(`Question not found`)
    }

    return question
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(
      `Something went wrong when getting question - ${err.message}`
    )
  }
}

export async function createQuestion({
  data,
}: {
  data: Omit<TMutateQuestionInput, "tags"> & {
    author: IQuestionDocument["author"]
  }
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const newQuestion: IQuestionDocument = await Question.create({
      ...data,
    })

    return newQuestion
  } catch (error) {
    const err = error as Error
    console.log("createQuestion Error", err)
    throw new Error(
      `Something went wrong when creating question - ${err.message}`
    )
  }
}

export async function findAndUpdateQuestion({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  data: UpdateQuery<IQuestionDocument> | undefined
  options?: QueryOptions<IQuestionDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const updatedQuestion: IQuestionDocument | null =
      await Question.findOneAndUpdate(filter, data, options)

    if (!updatedQuestion?._id) {
      throw new Error(`Question not found`)
    }

    return updatedQuestion
  } catch (error) {
    const err = error as Error
    console.log("===== findAndUpdateQuestion Error", err)
    throw new Error(
      `Something went wrong when updating question - ${err.message}`
    )
  }
}

export async function findAndDeleteQuestion({
  filter,
  options = {},
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  options?: QueryOptions<IQuestionDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const result = await Question.findOneAndDelete(filter, options)

    if (!result.value) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== findAndDeleteQuestion Error", err)
    throw new Error(
      `Something went wrong when deleting question - ${err.message}`
    )
  }
}

export async function findAndDeleteManyQuestions({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Question.deleteMany(filter)

    // if (!result.deletedCount) {
    //   throw new Error(`No questions found for the given filter`)
    // }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== findAndDeleteManyQuestions Error", err)
    throw new Error(
      `Something went wrong when deleting questions - ${err.message}`
    )
  }
}

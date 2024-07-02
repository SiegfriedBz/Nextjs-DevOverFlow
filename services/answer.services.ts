"use server"

import { NUM_RESULTS_PER_PAGE } from "@/constants"
import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateAnswerInput } from "@/lib/zod/answer.zod"
import Answer, { type IAnswerDocument } from "@/models/answer.model"
import type { IQuestionDocument } from "@/models/question.model"
import User from "@/models/user.model"
import type { TAnswer, TQueryParams } from "@/types"
import type {
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from "mongoose"
import mongoose from "mongoose"

export async function getAllAnswersForQuestionById({
  questionId,
  params,
}: {
  questionId: string
  params: Omit<TQueryParams, "localSearchQuery">
}) {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = NUM_RESULTS_PER_PAGE,
      localSortQuery,
      // globalSearchQuery = "",
    } = params

    // Step 1: Build aggregation pipeline
    const pipelineStages: PipelineStage[] = []

    // Match questions with _id === questionId
    pipelineStages.push({
      $match: { question: new mongoose.Types.ObjectId(questionId) },
    })

    // Step 2: Add numUpVotes fields
    pipelineStages.push({
      $addFields: {
        numUpVotes: { $size: "$upVoters" }, // Compute number of upVoters
      },
    })

    // Step 3: Conditionally sort Answers
    let sortQueryStage: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "highest_upvotes":
        sortQueryStage = { numUpVotes: -1 }
        break
      case "lowest_upvotes":
        sortQueryStage = { numUpVotes: 1 }
        break
      case "most_recent":
        sortQueryStage = { createdAt: -1 }
        break
      case "oldest":
        sortQueryStage = { createdAt: 1 }
        break
      default:
        sortQueryStage = { createdAt: -1 }
    }

    sortQueryStage && pipelineStages.push({ $sort: sortQueryStage })

    // Step 4: Add necessary fields
    const projectStage = {
      _id: 1,
      author: 1,
      content: 1,
      views: 1,
      question: 1,
      createdAt: 1,
      upVoters: 1,
      downVoters: 1,
    }

    pipelineStages.push({
      $project: projectStage,
    })

    // Step 5: add pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    pipelineStages.push({ $skip: skip })
    pipelineStages.push({ $limit: limit })

    // Step 6: Perform the aggregation query
    const answersAggregation = await Answer.aggregate(pipelineStages).exec()

    // Step 7: Populate
    const populateFields = [{ path: "author", model: User }]

    const result = await Answer.populate(answersAggregation, populateFields)

    const answers = JSON.parse(JSON.stringify(result))

    return answers
  } catch (error) {
    const err = error as Error
    console.log("getAllAnswers Error", err.message)
    throw new Error(`Could not fetch answers - ${err.message}`)
  }
}

export async function createAnswer({
  data,
}: {
  data: TMutateAnswerInput & {
    author: IAnswerDocument["author"]
  }
}): Promise<TAnswer> {
  try {
    await connectToMongoDB()

    const newAnswerDoc = await Answer.create({
      ...data,
    })

    const newAnswer = JSON.parse(JSON.stringify(newAnswerDoc))

    return newAnswer
  } catch (error) {
    const err = error as Error
    console.log("createAnswer Error", err)
    throw new Error(`Could not create answer - ${err.message}`)
  }
}

export async function updateAnswer({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
  data: UpdateQuery<IAnswerDocument> | undefined
  options?: QueryOptions<IAnswerDocument> | null | undefined
}): Promise<IAnswerDocument | null> {
  try {
    await connectToMongoDB()

    const updatedAnswer: IAnswerDocument | null = await Answer.findOneAndUpdate(
      filter,
      data,
      options
    )

    console.log("updateAnswer updatedAnswer", updatedAnswer)

    // TODO
    // if (!updatedAnswer?._id) {
    //   throw new Error(`Answer not found`)
    // }

    return updatedAnswer
  } catch (error) {
    const err = error as Error
    console.log("===== updateAnswer Error", err)
    throw new Error(`Could not update answer - ${err.message}`)
  }
}

export async function deleteAnswer({
  filter,
  options = {},
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
  options?: QueryOptions<IAnswerDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    const deletedDocument = await Answer.findOneAndDelete(filter, options)

    if (!deletedDocument) {
      throw new Error(`Answer not found`)
    }

    return deletedDocument
  } catch (error) {
    const err = error as Error
    console.log("===== deleteAnswer Error", err)
    throw new Error(`Could not delete answer - ${err.message}`)
  }
}

export async function deleteManyAnswers({
  filter,
}: {
  filter: FilterQuery<IAnswerDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Answer.deleteMany(filter)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteManyAnswers Error", err)
    throw new Error(`Could not delete answers - ${err.message}`)
  }
}

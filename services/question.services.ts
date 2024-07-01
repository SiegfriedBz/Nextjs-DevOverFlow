"use server"

import connectToMongoDB from "@/lib/mongoose.utils"
import type { TMutateQuestionInput } from "@/lib/zod/question.zod"
import Answer from "@/models/answer.model"
import Question, { type IQuestionDocument } from "@/models/question.model"
import Tag from "@/models/tag.model"
import User from "@/models/user.model"
import type { TQueryParams } from "@/types"
import type {
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from "mongoose"

export async function getHotQuestions({
  limit,
}: {
  limit: number
}): Promise<{ _id: string; title: string }[]> {
  try {
    await connectToMongoDB()

    const result = await Question.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          upVotersCount: { $size: "$upVoters" },
        },
      },
      {
        $sort: { views: -1, upVotersCount: -1 },
      },
      {
        $limit: limit,
      },
    ])

    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    const err = error as Error
    console.log("getHotQuestions Error", err.message)
    throw new Error(`Could not fetch hot questions - ${err.message}`)
  }
}

export async function getAllQuestions({ params }: { params: TQueryParams }) {
  try {
    await connectToMongoDB()

    const {
      page = 1,
      numOfResultsPerPage = 10,
      localSortQuery,
      localSearchQuery = "",
      // globalSearchQuery = "",
    } = params

    // searchQuery
    const searchQueryStage: FilterQuery<IQuestionDocument> = localSearchQuery
      ? {
          $or: [
            { title: { $regex: localSearchQuery, $options: "i" } },
            { content: { $regex: localSearchQuery, $options: "i" } },
          ],
        }
      : {}

    // Define the aggregation pipeline stages dynamically
    const pipelineStages: PipelineStage[] = [
      { $match: searchQueryStage },
      {
        $addFields: {
          numAnswers: { $size: "$answers" }, // Compute number of answers
          numOfUpVotes: { $size: "$upVoters" }, // Compute number of upVoters
        },
      },
    ]

    // Sort stage
    let sortQueryStage: Record<string, 1 | -1> | undefined
    switch (localSortQuery) {
      case "newest":
        sortQueryStage = { createdAt: -1 }
        break
      case "recommended":
        sortQueryStage = { numOfUpVotes: -1 }
        break
      case "frequent":
        sortQueryStage = { views: -1 }
        break
      // case "unanswered":
      // For "unanswered", we don't need to sort by numAnswers explicitly, just filter
      default:
        sortQueryStage = { createdAt: -1 } // Default to sorting by createdAt in descending order (newest first)
    }

    // Conditionally add $match stage for unanswered questions based on localSortQuery
    if (localSortQuery === "unanswered") {
      pipelineStages.push({ $match: { numAnswers: { $eq: 0 } } })
    }

    // Conditionally add $sort stage based on sortQueryStage
    if (sortQueryStage) {
      pipelineStages.push({ $sort: sortQueryStage })
    }

    // Add $project stage to include necessary fields
    const projectStage = {
      _id: 1,
      title: 1,
      content: 1,
      views: 1,
      createdAt: 1,
      author: 1,
      tags: 1,
      upVoters: 1,
      downVoters: 1,
      answers: 1,
    }
    pipelineStages.push({
      $project: projectStage,
    })

    // Pagination
    const limit = page * numOfResultsPerPage
    const skip = (page - 1) * numOfResultsPerPage
    pipelineStages.push({ $skip: skip })
    pipelineStages.push({ $limit: limit })

    // Perform the aggregation query with all defined pipeline stages
    const questionsAggregation = await Question.aggregate(pipelineStages).exec()

    // Fields to populate
    const populateFields = [
      { path: "author", model: User },
      { path: "tags", model: Tag },
      { path: "upVoters", model: User },
      { path: "downVoters", model: User },
      { path: "answers", model: Answer },
    ]

    // Populate
    const result = await Question.populate(questionsAggregation, populateFields)

    const questions = JSON.parse(JSON.stringify(result))

    return questions
  } catch (error) {
    const err = error as Error
    console.log("getAllQuestions Error", err.message)
    throw new Error(`Could not fetch questions - ${err.message}`)
  }
}

export async function getQuestion({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument>
}): Promise<IQuestionDocument> {
  try {
    const result: IQuestionDocument | null = await Question.findOne(
      filter
    ).populate([
      { path: "author", model: User, select: "_id clerkId name picture" },
      { path: "tags", model: Tag, select: "_id name" },
    ])

    if (!result) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(`Could not fetch question - ${err.message}`)
  }
}

export type TGetQuestionDataForEditReturn = {
  _id: string
  author: { clerkId: string }
  title: string
  content: string
  tags: { _id: string; name: string }[]
}

export async function getQuestionDataForEdit({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument>
}): Promise<TGetQuestionDataForEditReturn> {
  try {
    const result: IQuestionDocument | null = await Question.findOne(filter, {
      _id: 1,
      author: 1,
      title: 1,
      content: 1,
      tags: 1,
    }).populate([
      { path: "author", model: User, select: "clerkId" },
      { path: "tags", model: Tag, select: "_id name" },
    ])

    if (!result) {
      throw new Error(`Question not found`)
    }

    const question: TGetQuestionDataForEditReturn = JSON.parse(
      JSON.stringify(result)
    )

    return question
  } catch (error) {
    const err = error as Error
    console.log("getQuestion Error", err.message)
    throw new Error(`Could not fetch question - ${err.message}`)
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

    const result: IQuestionDocument = await Question.create({
      ...data,
    })

    return result
  } catch (error) {
    const err = error as Error
    console.log("createQuestion Error", err)
    throw new Error(`Could not create question - ${err.message}`)
  }
}

export async function updateQuestion({
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

    console.log("updateQuestion -> data", data)

    const result: IQuestionDocument | null = await Question.findOneAndUpdate(
      filter,
      data,
      options
    )

    if (!result) {
      throw new Error(`Question not found`)
    }

    console.log("updateQuestion -> result", result)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== updateQuestion Error", err)
    throw new Error(`Could not update question - ${err.message}`)
  }
}

export async function deleteQuestion({
  filter,
  options = {},
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  options?: QueryOptions<IQuestionDocument> | null | undefined
}): Promise<IQuestionDocument | null> {
  try {
    await connectToMongoDB()

    //  TODO
    // delete tags associated with question

    // delete question
    const result = await Question.findOneAndDelete(filter, options)
    if (!result) {
      throw new Error(`Question not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteQuestion Error", err)
    throw new Error(`Could not delete question - ${err.message}`)
  }
}

export async function updateManyQuestions({
  filter,
  data,
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
  data: UpdateQuery<IQuestionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Question.updateMany(filter, data)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== updateManyQuestions Error", err)
    throw new Error(`Could not update questions - ${err.message}`)
  }
}

export async function deleteManyQuestions({
  filter,
}: {
  filter: FilterQuery<IQuestionDocument> | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await Question.deleteMany(filter)

    return result
  } catch (error) {
    const err = error as Error
    console.log("===== deleteManyQuestions Error", err)
    throw new Error(`Could not delete questions - ${err.message}`)
  }
}

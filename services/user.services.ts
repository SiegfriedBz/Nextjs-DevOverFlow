import { TMutateUserData } from "@/app/api/v1/webhooks/clerk/route"
import connectToMongoDB from "@/lib/mongoose.utils"
import User, { type IUserDocument } from "@/models/user.model"
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose"

export async function getUser({
  filter,
}: {
  filter: FilterQuery<IUserDocument>
}): Promise<IUserDocument> {
  try {
    await connectToMongoDB()

    const user: IUserDocument | null = await User.findOne(filter)
    if (!user?._id) {
      throw new Error(`User not found`)
    }

    return user
  } catch (error) {
    const err = error as Error
    console.log("getUser Error", err.message)
    throw new Error(`Something went wrong when getting user - ${err.message}`)
  }
}

export async function createUser(
  userData: TMutateUserData
): Promise<IUserDocument> {
  try {
    await connectToMongoDB()

    const newUser: IUserDocument = await User.create(userData)

    return newUser
  } catch (error) {
    const err = error as Error
    console.log("createUser Error", err.message)
    throw new Error(`Something went wrong when creating user - ${err.message}`)
  }
}

export async function findAndUpdateUser({
  filter,
  data,
  options = { new: true },
}: {
  filter: FilterQuery<IUserDocument> | undefined
  data: UpdateQuery<IUserDocument> | undefined
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    await connectToMongoDB()

    const updatedUser = await User.findOneAndUpdate(filter, data, options)
    if (!updatedUser?._id) {
      throw new Error(`User not found`)
    }

    return updatedUser
  } catch (error) {
    const err = error as Error
    console.log("findAndUpdateUser Error", err.message)
    throw new Error(`Something went wrong when updating user - ${err.message}`)
  }
}

export async function findAndDeleteUser({
  filter,
  options = {},
}: {
  filter: FilterQuery<IUserDocument> | undefined
  options?: QueryOptions<any> | null | undefined
}) {
  try {
    await connectToMongoDB()

    const result = await User.findOneAndDelete(filter, options)
    if (!result.value) {
      throw new Error(`User not found`)
    }

    return result
  } catch (error) {
    const err = error as Error
    console.log("findAndDeleteUser Error", err.message)
    throw new Error(`Something went wrong when deleting user - ${err.message}`)
  }
}

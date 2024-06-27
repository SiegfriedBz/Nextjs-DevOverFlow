import mongoose from "mongoose"

let isConnected = false

const MONGODB_URL = process.env.MONGODB_URL

const connectToMongoDB = async () => {
  mongoose.set("strictQuery", true)

  if (!MONGODB_URL) {
    return console.log("Missing MONGODB_URL")
  }

  if (isConnected) {
    return console.log("MONGODB already connected")
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: "DevFlow",
    })
    isConnected = true

    console.log("MONGODB is connected")
  } catch (error) {
    console.log("MONGODB error", error)
  }
}

export default connectToMongoDB

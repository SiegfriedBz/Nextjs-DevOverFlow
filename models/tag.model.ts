import { Document, model, models, Schema } from "mongoose"

export interface ITagDocument extends Document {
  name: string
  description: string
  questions: Schema.Types.ObjectId[] // Question
  followers: Schema.Types.ObjectId[] // Follower
  createdAt: Date
}

const tagSchema = new Schema<ITagDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Question
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // User
  createdAt: { type: Date, default: Date.now },
})

const Tag = models.Tag || model<ITagDocument>("Tag", tagSchema)

export default Tag

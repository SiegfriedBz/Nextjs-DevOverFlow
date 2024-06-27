import { Document, Schema, model, models } from "mongoose"

export interface IQuestionDocument extends Document {
  title: string
  description: string
  views: number
  author: Schema.Types.ObjectId // User
  upVoters: Schema.Types.ObjectId[] // User
  downVoters: Schema.Types.ObjectId[] // User
  tags: Schema.Types.ObjectId[] // Tag
  answers: Schema.Types.ObjectId[] // Answer
  createdAt: Date
}

const questionSchema = new Schema<IQuestionDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  views: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  upVoters: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downVoters: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  createdAt: { type: Date, default: Date.now },
})

const Question =
  models.Question || model<IQuestionDocument>("Question", questionSchema)

export default Question

import { model, models, Schema, Types } from "mongoose"

export interface IAnswerDocument extends Document {
  author: Schema.Types.ObjectId // User
  content: string
  createdAt: Date
  upVoters: Schema.Types.ObjectId[] // User
  downVoters: Schema.Types.ObjectId[] // User
  question: Schema.Types.ObjectId // Question
}

const answerSchema = new Schema<IAnswerDocument>({
  author: { type: Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  createdAt: { type: Date, default: Date.now },
  upVoters: [{ type: Types.ObjectId, ref: "User" }],
  downVoters: [{ type: Types.ObjectId, ref: "User" }],
})

const Answer = models.Answer || model<IAnswerDocument>("Answer", answerSchema)

export default Answer

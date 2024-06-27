import { model, models, Schema, Types } from "mongoose"

export interface IAnswerDocument extends Document {
  author: Schema.Types.ObjectId // User
  content: string
}

const answerSchema = new Schema<IAnswerDocument>(
  {
    author: { type: Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
)

const Answer = models.Answer || model<IAnswerDocument>("Answer", answerSchema)

export default Answer

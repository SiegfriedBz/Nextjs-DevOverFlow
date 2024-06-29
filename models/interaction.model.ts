import { Document, model, models, Schema } from "mongoose"

export interface IInteractionDocument extends Document {
  user: Schema.Types.ObjectId
  actionType: "view" | "like"
  question?: Schema.Types.ObjectId
  answer?: Schema.Types.ObjectId
  tag?: Schema.Types.ObjectId
  createdAt: Date
}

const interactionSchema = new Schema<IInteractionDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  actionType: { type: String, enum: ["view", "like"], required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  createdAt: { type: Date, default: Date.now },
})

const Interaction =
  models.Interaction ||
  model<IInteractionDocument>("Interaction", interactionSchema)

export default Interaction

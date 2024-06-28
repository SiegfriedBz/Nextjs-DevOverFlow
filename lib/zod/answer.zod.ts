import { z } from "zod"

const mutateAnswerSchema = z.object({
  content: z.string().min(20),
  question: z.string(), // question._id
})

type TMutateAnswerInput = z.infer<typeof mutateAnswerSchema>
export { mutateAnswerSchema, type TMutateAnswerInput }

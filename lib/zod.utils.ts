import { z } from "zod"

const createQuestionSchema = z.object({
  title: z.string().min(5).max(130),
  description: z.string().min(20),
  tags: z
    .array(z.string().min(1).max(15))
    .min(1, { message: "Must have at least 1 tag" })
    .max(3, { message: "Must have 3 tags max" }),
})

type TcreateQuestionInput = z.infer<typeof createQuestionSchema>
export { createQuestionSchema, type TcreateQuestionInput }

import { z } from "zod"

const mutateUserSchema = z.object({
  name: z.string().min(5).max(50),
  userName: z.string().min(5).max(50),
  location: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolio: z.string().url().optional(),
})

type TMutateUserInput = z.infer<typeof mutateUserSchema>
export { mutateUserSchema, type TMutateUserInput }

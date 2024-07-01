"use client"

import TinyEditor from "@/components/forms/TinyEditor"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  type TMutateAnswerInput,
  mutateAnswerSchema,
} from "@/lib/zod/answer.zod"
import { createAnswerAction } from "@/server-actions/answer.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
  questionId: string
}
const AnswerForm = ({ questionId }: TProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<TMutateAnswerInput>({
    resolver: zodResolver(mutateAnswerSchema),
    defaultValues: {
      content: "",
      question: questionId as string,
    },
  })

  async function onSubmit(values: TMutateAnswerInput) {
    setIsSubmitting(true)

    try {
      await createAnswerAction({ data: values })

      form.reset()
      toast.success(`Answer created successfully!`)
    } catch (error) {
      console.log(error)
      toast.error(`Could not submit your answer.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log("WATCH", form.watch("question"))

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3.5 flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Write your answer here
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <TinyEditor
                  handleEditorChange={(content: string) =>
                    field.onChange(content)
                  }
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="primary-gradient w-fit self-end rounded-xl !text-light-900"
          type="submit"
        >
          {isSubmitting ? <span>Posting...</span> : <span>Post Answer</span>}
        </Button>
      </form>
    </Form>
  )
}

export default AnswerForm

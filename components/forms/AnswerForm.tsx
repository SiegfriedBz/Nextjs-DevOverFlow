"use client"

import TinyEditor from "@/components/forms/TinyEditor"
import Loading from "@/components/shared/Loading"
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
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
  questionId: string
  questionforAI: { title: string; content: string }
}
const AnswerForm = ({ questionId, questionforAI }: TProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingAI, setIsSubmittingAI] = useState(false)
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
      form.clearErrors()
      toast.success(`Answer created successfully!`)
    } catch (error) {
      console.log(error)
      toast.error(`Could not submit your answer.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    form.clearErrors()
  }, [form])

  const generateAIAnswer = async () => {
    if (!questionId) return

    try {
      setIsSubmittingAI(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionforAI),
        }
      )

      if (!response.ok) {
        throw new Error("Could not get answer from EdenAI")
      }

      const data = await response.json()

      if (data.error) {
        throw data.error
      }

      const aiAnswer = data?.aiAnswer

      form.setValue("content", aiAnswer)
    } catch (error) {
      console.log("generateAIAnswer ERROR", error)
    } finally {
      setIsSubmittingAI(false)
    }
  }

  return (
    <>
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
                <FormLabel className="paragraph-semibold text-dark400_light800 flex flex-col">
                  <span>Write your answer here</span>
                  {/*   Generate AI Answer button */}
                  <Button
                    type="button"
                    disabled={isSubmittingAI}
                    onClick={generateAIAnswer}
                    className="btn light-border-2 my-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                  >
                    {isSubmittingAI ? (
                      <>
                        <Loading />
                      </>
                    ) : (
                      <>
                        <Image
                          src="/assets/icons/stars.svg"
                          alt="star"
                          width={12}
                          height={12}
                          className="object-contain"
                        />
                        Generate AI Answer
                      </>
                    )}
                  </Button>
                </FormLabel>

                <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                  <TinyEditor
                    editorValue={field.value}
                    editorInitialValue={field.value}
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
    </>
  )
}

export default AnswerForm

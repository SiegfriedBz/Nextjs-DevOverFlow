"use client"

import TinyEditor from "@/components/forms/TinyEditor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  createQuestionSchema,
  type TcreateQuestionInput,
} from "@/lib/zod.utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

type TProps = {
  actionType: "create" | "edit"
}
const QuestionForm = ({ actionType = "create" }: TProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<TcreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  })

  const handleAddTag = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault()
      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (!tagValue) return

      if (tagValue.length > 15)
        return form.setError("tags", {
          message: "Tag must be less than 15 characters.",
        })

      const currentTagValues = field.value
      if (!currentTagValues.includes(tagValue)) {
        console.log("tagValue", tagValue)
        form.setValue("tags", [...currentTagValues, tagValue])
        tagInput.value = ""
        form.clearErrors("tags")
      }
    } else {
      form.trigger()
    }
  }

  const handleRemoveTag = (tag: string) => {
    const newTags = form.getValues("tags").filter((t) => t !== tag)
    form.setValue("tags", newTags)
  }

  const createQuestionAction = async () => {}
  const editQuestionAction = async () => {}

  async function onSubmit(values: TcreateQuestionInput) {
    setIsSubmitting(true)

    try {
      const response =
        actionType === "create"
          ? await createQuestionAction()
          : await editQuestionAction()

      console.log("response", response)

      //  navigate to home page
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3.5 flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  placeholder="What is Zod for ?"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos; re asking a question to
                another person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Description of your issue{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <TinyEditor />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleAddTag(e, field)}
                  />
                  <>
                    {field.value.length > 0 && (
                      <ul className="flex flex-wrap gap-4">
                        {field.value.map((tag) => {
                          return (
                            <Badge
                              key={tag}
                              onClick={() => handleRemoveTag(tag)}
                              className={`body-medium body-regular light-border flex 
                            cursor-pointer items-center justify-center gap-x-2 rounded-xl
                            border-none bg-light-800 px-4 py-2.5 
                            capitalize 
                            text-light-500 
                            hover:bg-light-700 dark:bg-dark-300 dark:text-light-500
                            dark:hover:bg-dark-200
                          `}
                            >
                              <Image
                                src="/assets/icons/close.svg"
                                alt="close icon"
                                width={12}
                                height={12}
                                className="invert-0 dark:invert"
                              />
                              {tag}
                            </Badge>
                          )
                        })}
                      </ul>
                    )}
                  </>
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          disabled={isSubmitting}
          className="primary-gradient w-fit self-end rounded-xl !text-light-900"
          type="submit"
        >
          {isSubmitting ? (
            <span>{actionType === "create" ? "Posting..." : "Editing..."}</span>
          ) : (
            <span>
              {actionType === "create" ? "Ask Question" : "Edit Question"}
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default QuestionForm

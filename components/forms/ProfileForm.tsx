"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { mutateUserSchema, type TMutateUserInput } from "@/lib/zod/user.zod"
import { updateUserAction } from "@/server-actions/user.actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
  userClerkId: string
  userData: TMutateUserInput
}
const ProfileForm = ({ userClerkId, userData }: TProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<TMutateUserInput>({
    resolver: zodResolver(mutateUserSchema),
    defaultValues: {
      name: userData?.name || "",
      userName: userData?.userName || "",
      portfolio: userData?.portfolio || "",
      location: userData?.location || "",
      bio: userData?.bio || "",
    },
  })

  async function onSubmit(values: TMutateUserInput) {
    setIsSubmitting(true)

    try {
      await updateUserAction({
        filter: {
          clerkId: userClerkId,
        },
        data: values,
      })

      toast.success(`Profile updated successfully!`)
      router.push(`/profile/${userClerkId}`)
    } catch (error) {
      console.log(error)
      toast.error(`Could not update your profile.`)
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Full Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <Input
                  placeholder="Your name..."
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                userName <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <Input
                  placeholder="Your user name..."
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  placeholder="https://siegfried-bozza-portfolio.vercel.app"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  placeholder="Zurich, Switzerland"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="background-light900_dark300 light-border-2 mt-3.5 ">
                <Textarea
                  placeholder="Your bio..."
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-14 rounded-lg border"
                  {...field}
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
          {isSubmitting ? (
            <span>Updating...</span>
          ) : (
            <span>Update Profile</span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm

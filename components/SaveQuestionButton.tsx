"use client"

import { toggleSaveQuestionAction } from "@/server-actions/user.actions"
import { Error } from "mongoose"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "./ui/button"

type TProps = {
  questionId: string
  currentUserMongoId: string
  userHasSavedQuestion: boolean
}

const SaveQuestionButton = ({
  questionId,
  currentUserMongoId,
  userHasSavedQuestion,
}: TProps) => {
  const router = useRouter()

  const handleToggleSaveQuestion = async () => {
    try {
      if (!currentUserMongoId) {
        router.push("/sign-in")
        router.refresh()
        toast.info(`Please sign in to vote`)
        return
      }

      const updatedUser = await toggleSaveQuestionAction({ questionId })

      if (updatedUser instanceof Error) {
        throw new Error(`Could not update question in your favorites`)
      }

      toast.success("Question updated in your favorites successfully")
    } catch (error) {
      const err = error as Error
      console.log("handleSaveQuestion error", err)
      toast.warning("Could not update the question in your favorites")
    }
  }

  return (
    <Button onClick={handleToggleSaveQuestion} type="button" className="p-0">
      <Image
        src={`/assets/icons/${userHasSavedQuestion ? "star-filled" : "star-red"}.svg`}
        alt="star"
        width={24}
        height={24}
      />
    </Button>
  )
}

export default SaveQuestionButton

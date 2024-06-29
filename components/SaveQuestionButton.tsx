"use client"

import { updateUserAction } from "@/server-actions/user.actions"
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
        toast.info(`Please sign-in to vote`)
        return
      }

      const query = userHasSavedQuestion
        ? {
            $pull: { savedQuestions: questionId },
          }
        : {
            $push: { savedQuestions: questionId },
          }

      const updatedUser = await updateUserAction({
        filter: { _id: currentUserMongoId },
        data: query,
      })

      if (updatedUser instanceof Error) {
        throw new Error(
          `Could not ${userHasSavedQuestion ? "remove question from" : "add question to"} your favorites`
        )
      }
      if (userHasSavedQuestion) {
        toast.info("Question removed from your favorites successfully")
      } else {
        toast.success("Question added to your favorites successfully")
      }
    } catch (error) {
      const err = error as Error
      console.log("handleSaveQuestion error", err)
      toast.warning("Could not add question to your favorites")
    }
  }

  return (
    <Button onClick={handleToggleSaveQuestion} type="button" className="p-0">
      <Image
        src="/assets/icons/star.svg"
        alt="star"
        width={24}
        height={24}
        className={`invert-colors ${userHasSavedQuestion ? "bg-red-500" : "bg-blue-500"}`}
      />
    </Button>
  )
}

export default SaveQuestionButton

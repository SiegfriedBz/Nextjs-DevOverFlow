"use client"

import { updateUserAction } from "@/server-actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { Error } from "mongoose"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "./ui/button"

type TProps = {
  questionId: string
  currentUserMongoId: string
  currentUserSavedQuestions: string[]
}

const SaveQuestionButton = ({
  questionId,
  currentUserMongoId,
  currentUserSavedQuestions,
}: TProps) => {
  const router = useRouter()

  const questionIsUserFavorite = currentUserSavedQuestions.some(
    (q) => q === questionId
  )

  console.log("questionIsUserFavorite", questionIsUserFavorite)

  const handleToggleSaveQuestion = async () => {
    try {
      if (!currentUser) {
        router.push("/sign-in")
      }

      const query = questionIsUserFavorite
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
        throw new Error("Could not add question to your favorites")
      }

      toast.success("Question added to your favorites successfully")
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
        className={`invert-colors ${questionIsUserFavorite ? "bg-red-500" : "bg-blue-500"}`}
      />
    </Button>
  )
}

export default SaveQuestionButton

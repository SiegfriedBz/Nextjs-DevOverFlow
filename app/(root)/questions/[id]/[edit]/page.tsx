import QuestionForm from "@/components/forms/QuestionForm"
import {
  getQuestionDataForEdit,
  type TGetQuestionDataForEditReturn,
} from "@/services/question.services"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

type TProps = {
  params: { id: string }
}
const EditQuestionPage = async ({ params }: TProps) => {
  const { id: questionId } = params

  const question: TGetQuestionDataForEditReturn = await getQuestionDataForEdit({
    filter: { _id: questionId },
  })

  console.log("EditQuestionPage -> question", question)

  const qestionAuthorClerkId = question?.author?.clerkId

  // get current user
  const currentClerkUser = await currentUser()
  const currentClerkUserClerkId = currentClerkUser?.id

  if (!currentClerkUser) {
    redirect("/sign-in")
  }

  if (currentClerkUserClerkId !== qestionAuthorClerkId) {
    redirect("/")
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm actionType="edit" questionData={question} />
      </div>
    </>
  )
}

export default EditQuestionPage

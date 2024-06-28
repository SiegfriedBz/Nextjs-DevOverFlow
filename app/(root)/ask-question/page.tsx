import QuestionForm from "@/components/forms/QuestionForm"

const AskQuestionPage = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <QuestionForm actionType="create" />
    </div>
  )
}

export default AskQuestionPage

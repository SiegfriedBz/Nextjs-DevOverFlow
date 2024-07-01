import Metric from "./Metric"

type TQuestionMetricsProps = {
  daysAgo: number
  numAnswers: number
  views: number
}

const QuestionMetrics = ({
  daysAgo,
  numAnswers,
  views,
}: TQuestionMetricsProps) => {
  return (
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <Metric
        imageSrc="/assets/icons/clock.svg"
        alt="clock icon"
        value={`Asked ${
          daysAgo === 0
            ? "Today"
            : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`
        }`}
      />
      <Metric
        imageSrc="/assets/icons/message.svg"
        alt="numOfAnswers"
        value={numAnswers}
        title={` Answer${numAnswers > 1 ? "s" : ""}`}
      />
      <Metric
        imageSrc="/assets/icons/eye.svg"
        alt="numOfViews"
        value={views}
        title={` View${views > 1 ? "s" : ""}`}
      />
    </div>
  )
}

export default QuestionMetrics

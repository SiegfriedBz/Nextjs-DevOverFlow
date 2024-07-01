import { TTag } from "@/types"
import Tag from "./Tag"

type TQuestionTagsProps = {
  tags: TTag[]
}

const QuestionTags = ({ tags }: TQuestionTagsProps) => {
  return (
    <ul className="mt-8 flex flex-wrap gap-4">
      {(tags as TTag[]).map((tag) => {
        return (
          <li key={tag._id}>
            <Tag {...tag} />
          </li>
        )
      })}
    </ul>
  )
}

export default QuestionTags

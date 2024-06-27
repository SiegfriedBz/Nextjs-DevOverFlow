import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TTag } from "@/types"
import Link from "next/link"

type TProps = TTag

const TagCard = ({
  _id,
  name,
  description,
  questions,
  // followers,
  // createdAt,
}: TProps) => {
  return (
    <Card
      className="background-light900_dark200
        text-dark400_light700   
        shadow-light100_darknone 
        light-border rounded-xl
        border
        px-8
        py-10
        shadow-none outline-none
        sm:w-[260px]
      "
    >
      <Link href={`/tags/${_id}`}>
        <CardHeader>
          <CardTitle className="flex w-full justify-center">
            <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
              <p className="paragraph-semibold text-dark300_light900 whitespace-nowrap">
                {name}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Link>
      <CardContent>
        <p className="small-medium text-dark400_light500 mt-3.5">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <p>
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions?.length}+
          </span>{" "}
          Questions
        </p>
      </CardFooter>
    </Card>
  )
}

export default TagCard

import Tag from "@/components/Tag"
import Image from "next/image"
import Link from "next/link"
import SideBar from "./Sidebar"
import { getHotQuestions } from "@/services/question.services"
import { getHotTags } from "@/services/tags.services."

const RightSidebar = async () => {
  const [hotQuestions, hotTags] = await Promise.all([
    getHotQuestions({ limit: 5 }),
    getHotTags({ limit: 5 }),
  ])

  return (
    <SideBar className="custom-scrollbar h-[calc(100vh-3rem)] w-[350px] overflow-y-auto overflow-x-hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex flex-col gap-8">
          {hotQuestions?.map((q) => {
            const { _id, title } = q

            return (
              <Link
                key={_id}
                href={`/questions/${_id}`}
                className="flex cursor-pointer items-center justify-between"
              >
                <p className="body-medium text-dark500_light700 truncate">
                  {title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  width={20}
                  height={20}
                  alt="chevron-right"
                  className="invert-colors"
                />
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {hotTags?.map((tag) => {
            return <Tag key={tag._id} {...tag} showCount={true} />
          })}
        </div>
      </div>
    </SideBar>
  )
}

export default RightSidebar

import Tag from "@/components/shared/Tag"
import Image from "next/image"
import Link from "next/link"
import SideBar from "./Sidebar"

const hotQuestions = [
  { _id: "1", title: "Stuff" },
  { _id: "2", title: "Stuff 2" },
  { _id: "3", title: "Stuff 3" },
]
const popularTags = [
  { _id: "1", name: "Stuff", totalQuestions: 2 },
  { _id: "2", name: "Stuff 2", totalQuestions: 24 },
  { _id: "3", name: "Stuff 3", totalQuestions: 28 },
  { _id: "12", name: "Stuff", totalQuestions: 2 },
  { _id: "22", name: "Stuff 2", totalQuestions: 24 },
  { _id: "31", name: "Stuff 3", totalQuestions: 28 },
  { _id: "14", name: "Stuff", totalQuestions: 2 },
  { _id: "25", name: "Stuff 2", totalQuestions: 24 },
  { _id: "33", name: "Stuff 3", totalQuestions: 28 },
  { _id: "1d4", name: "Stuff", totalQuestions: 2 },
  { _id: "25s", name: "Stuff 2", totalQuestions: 24 },
  { _id: "3d3", name: "Stuff 3", totalQuestions: 28 },
]

const RightSidebar = () => {
  return (
    <SideBar className="custom-scrollbar h-[calc(100vh-3rem)] w-[350px] overflow-y-auto">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-8">
          {hotQuestions?.map((q) => {
            const { _id, title } = q

            return (
              <Link
                key={_id}
                href={`/questions/${_id}`}
                className="flex cursor-pointer items-center justify-between"
              >
                <p className="body-medium text-dark500_light700">{title}</p>
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
          {popularTags?.map((tag) => {
            return <Tag key={tag._id} {...tag} showCount={true} />
          })}
        </div>
      </div>
    </SideBar>
  )
}

export default RightSidebar

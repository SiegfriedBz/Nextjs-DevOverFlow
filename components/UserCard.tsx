import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { TUser } from "@/types"
import Image from "next/image"
import Link from "next/link"

type TProps = TUser

const UserCard = ({
  _id,
  clerkId,
  name,
  userName,

  picture,
}: TProps) => {
  return (
    <Card
      className="background-light800_darkgradient 
        text-dark400_light700   
        rounded-xl border-none px-4
        py-2
        shadow-none
        outline-none max-sm:w-full
        xs:min-w-[280px]
        sm:max-w-[324px]
        sm:px-10
      "
    >
      <Link href={`/profile/${clerkId}`}>
        <CardHeader>
          <CardTitle className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1">
            <div className="flex flex-col items-center">
              <Image
                src={picture || "/assets/icons/avatar.svg"}
                width={125}
                height={125}
                alt="user avatar"
                className="flex-1 rounded-full"
              />
              <h2 className="my-4">{userName}</h2>
              <span className="background-light800_dark300 text-light400_light500 mb-2 text-sm lowercase">{`@${name?.split(" ").at(0)}`}</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Link>
      {/* TODO */}
      {/* <CardContent>
        <Suspense fallback={<UserTagListWrapperSkeleton />}>
          <TagListWrapper userId={_id} />
        </Suspense>
      </CardContent> */}
    </Card>
  )
}

export default UserCard

// TODO
// const TagListWrapper = async ({ userId }: { userId: string }) => {
//   const favoredTags = await getUserTopTags({ userId, limit: 3 })

//   return favoredTags?.length > 0 ? (
//     <ul className="flex w-full justify-center gap-x-4">
//       {favoredTags?.map((tag, index) => {
//         return (
//           <li key={`user-${userId}-tag-${index}`}>
//             <Tag {...tag} />
//           </li>
//         )
//       })}
//     </ul>
//   ) : (
//     <Badge className="flex w-full justify-center">No tags yet</Badge>
//   )
// }

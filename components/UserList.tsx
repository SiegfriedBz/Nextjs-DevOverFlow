import type { TUser } from "@/types"
import UserCard from "./UserCard"
import React from "react"

type TProps = {
  data: TUser[] | null
  children: React.ReactNode
}

const UserList = ({ data, children }: TProps) => {
  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-wrap justify-start gap-8 max-sm:justify-center">
      {data.map((user) => {
        return (
          <li key={user._id} className="h-full">
            <UserCard {...user} />
          </li>
        )
      })}
    </ul>
  ) : (
    // NoResult
    <>{children}</>
  )
}

export default UserList

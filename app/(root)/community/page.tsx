import NoResult from "@/components/shared/NoResult"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import UserCard from "@/components/UserCard"
import UserCardSkeleton from "@/components/UserCardSkeleton"
import { COMMUNITY_FILTER_OPTIONS } from "@/constants/filters"
import { getAllUsers } from "@/services/user.services"
import type { TSearchParamsProps, TUser } from "@/types"
import { Suspense } from "react"

const CommunityPage = ({ searchParams }: TSearchParamsProps) => {
  return (
    <div>
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search amazing minds here..."
        />

        <CustomFilter
          filterName="filter"
          filterOptions={COMMUNITY_FILTER_OPTIONS}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<UserListWrapperSkeleton />}>
          <UserListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default CommunityPage

const UserListWrapper = async ({ searchParams }: TSearchParamsProps) => {
  const localFilterQuery = searchParams?.q
  const globalFilterQuery = searchParams?.global

  const data: TUser[] | null = await getAllUsers({
    params: { localFilterQuery, globalFilterQuery },
  })

  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-wrap justify-start gap-8">
      {data.map((user) => {
        return (
          <li key={user._id} className="h-full">
            <UserCard {...user} />
          </li>
        )
      })}
    </ul>
  ) : (
    <NoResult
      resultType="user"
      paragraphContent="Join now to help our Community grow ! 🚀"
      href="/sign-up"
      linkLabel="Join now to be the first !"
      className="mt-2 font-bold text-accent-blue"
    />
  )
}

const UserListWrapperSkeleton = () => {
  return (
    <ul className="flex w-full flex-wrap justify-start gap-8">
      {Array.from({ length: 8 }, (_, index) => {
        return <UserCardSkeleton key={index} />
      })}
    </ul>
  )
}

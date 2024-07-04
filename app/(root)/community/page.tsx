import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import UserCardSkeleton from "@/components/UserCardSkeleton"
import UserList from "@/components/UserList"
import { COMMUNITY_FILTER_OPTIONS } from "@/constants/filters"
import { getAllUsers } from "@/services/user.services"
import type { TSearchParamsProps, TUser } from "@/types"
import { Suspense } from "react"

const CommunityPage = ({ searchParams }: TSearchParamsProps) => {
  return (
    <>
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search amazing minds here..."
        />

        <CustomFilter
          filterName="sort"
          filterOptions={COMMUNITY_FILTER_OPTIONS}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<UserListWrapperSkeleton />}>
          <UserListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  )
}

export default CommunityPage

const UserListWrapper = async ({ searchParams }: TSearchParamsProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && parseInt(pageStr, 10)) || 1
  const searchQueryParam = searchParams?.q
  const sortQueryParam = searchParams?.sort

  const data = await getAllUsers({
    maxPageSize:
      (process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE &&
        +process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE) ||
      20,
    params: { page, searchQueryParam, sortQueryParam },
  })

  const users: TUser[] | null = data?.users
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <UserList data={users}>
          <NoResult
            resultType="user"
            paragraphContent="Join now to help our Community grow ! 🚀"
            href="/sign-up"
            linkLabel="Join now to be the first !"
            className="mt-2 font-bold text-accent-blue"
          />
        </UserList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
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

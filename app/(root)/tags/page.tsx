import NoResult from "@/components/shared/NoResult"
import Pagination from "@/components/shared/Pagination"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import TagCardSkeleton from "@/components/TagCardSkeleton"
import TagList from "@/components/TagList"
import { TAGS_FILTER_OPTIONS } from "@/constants/filters"
import { getAllTags } from "@/services/tags.services."
import type { TSearchParamsProps, TTag } from "@/types"
import { Suspense } from "react"

const TagsPage = ({ searchParams }: TSearchParamsProps) => {
  return (
    <div>
      <div className="flex w-full items-center max-sm:flex-col-reverse sm:justify-between">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      </div>

      <div className="mt-4 flex justify-between gap-5 max-sm:flex-col sm:items-center md:flex-col">
        <LocalSearchBar
          queryParamName="q"
          placeholder="Search by tag name..."
        />

        <CustomFilter filterName="sort" filterOptions={TAGS_FILTER_OPTIONS} />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-8 sm:items-center">
        <Suspense fallback={<TagListWrapperSkeleton />}>
          <TagListWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

export default TagsPage

const TagListWrapper = async ({ searchParams }: TSearchParamsProps) => {
  const pageStr = searchParams?.page
  const page = (pageStr && +pageStr) || 1
  const searchQueryParam = searchParams?.q
  const sortQueryParam = searchParams?.sort

  const data = await getAllTags({
    maxPageSize:
      (process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE &&
        +process.env.NEXT_PUBLIC_NUM_RESULTS_PER_PAGE) ||
      20,
    params: { page, searchQueryParam, sortQueryParam },
  })

  const tags: TTag[] | null = data?.tags
  const hasNextPage = !!data?.hasNextPage

  return (
    <>
      <div className="w-full">
        <TagList data={tags}>
          <NoResult
            resultType="tag"
            paragraphContent="It looks like no tag was found"
            href="/ask-question"
            linkLabel="Ask a question"
            className="mt-2 font-bold text-accent-blue"
          />
        </TagList>
      </div>

      <div className="mt-2 w-full">
        <Pagination hasNextPage={hasNextPage} />
      </div>
    </>
  )
}

const TagListWrapperSkeleton = () => {
  return (
    <ul className="flex w-full flex-wrap justify-start gap-8">
      {Array.from({ length: 6 }, (_, index) => {
        return <TagCardSkeleton key={index} />
      })}
    </ul>
  )
}

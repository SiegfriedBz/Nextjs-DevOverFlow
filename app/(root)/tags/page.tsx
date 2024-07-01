import NoResult from "@/components/shared/NoResult"
import CustomFilter from "@/components/shared/search/filter/CustomFilter"
import LocalSearchBar from "@/components/shared/search/LocalSearchBar"
import TagCard from "@/components/TagCard"
import TagCardSkeleton from "@/components/TagCardSkeleton"
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
  const localSearchQuery = searchParams?.q
  const globalSearchQuery = searchParams?.globalQ

  const data: TTag[] | null = await getAllTags({
    params: { localSearchQuery, globalSearchQuery },
  })

  return data && data?.length > 0 ? (
    <ul className="flex w-full flex-wrap justify-start gap-8">
      {data.map((tag) => {
        return (
          <li key={tag._id} className="h-full">
            <TagCard {...tag} />
          </li>
        )
      })}
    </ul>
  ) : (
    <NoResult
      resultType="tag"
      paragraphContent="It looks like no tag was found"
      href="/ask-question"
      linkLabel="Ask a question"
      className="mt-2 font-bold text-accent-blue"
    />
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

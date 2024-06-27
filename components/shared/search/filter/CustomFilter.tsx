"use client"
import useQueryParams from "@/hooks/useQueryParams"
import FilterBadgeSelect from "./FilterBadgeSelect"
import FilterCustomSelect from "./FilterCustomSelect"

type TFilterWrapperProps = {
  filterName: string
  filterOptions: string[]
}
const CustomFilter = ({ filterName, filterOptions }: TFilterWrapperProps) => {
  const [filter, setFilter] = useQueryParams({
    queryParamName: filterName,
    debounceDelay: 0,
  })

  return (
    <>
      <FilterBadgeSelect
        filter={filter}
        setFilter={setFilter}
        options={filterOptions}
        wrapperClassName="flex w-full max-md:hidden md:my-4 -ms-8"
        className="max-md:h-16 md:h-10"
      />

      <FilterCustomSelect
        filter={filter}
        setFilter={setFilter}
        options={filterOptions}
        wrapperClassName="max-sm:w-full sm:w-1/2 sm:min-w-44 md:hidden"
        className="max-md:h-16 md:h-10"
      />
    </>
  )
}

export default CustomFilter

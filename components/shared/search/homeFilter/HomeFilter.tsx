"use client"
import useQueryParams from "@/hooks/useQueryParams"
import React from "react"
import FilterCustomSelect from "./FilterCustomSelect"
import FilterBadgeSelect from "./FilterBadgeSelect"
import { HOME_FILTER_OPTIONS } from "@/constants/filters"

type TFilterWrapperProps = {
  filterName: string
}
const HomeFilter = ({ filterName }: TFilterWrapperProps) => {
  const [filter, setFilter] = useQueryParams({
    queryParamName: filterName,
    debounceDelay: 0,
  })

  return (
    <>
      <FilterBadgeSelect
        filter={filter}
        setFilter={setFilter}
        options={HOME_FILTER_OPTIONS}
        wrapperClassName="flex w-full gap-4 max-md:hidden md:my-4"
        className="max-md:h-16 md:h-10"
      />

      <FilterCustomSelect
        filter={filter}
        setFilter={setFilter}
        options={HOME_FILTER_OPTIONS}
        wrapperClassName="max-sm:w-full sm:w-1/2 sm:min-w-44 md:hidden"
        className="max-md:h-16 md:h-10"
      />
    </>
  )
}

export default HomeFilter

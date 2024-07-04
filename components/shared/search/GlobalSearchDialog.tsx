"use client"

// eslint-disable-next-line camelcase
import { GLOBAL_FILTER_OPTIONS } from "@/constants/filters"
import useQueryParams from "@/hooks/useQueryParams"
import React, { MutableRefObject, useEffect, useRef } from "react"
import FilterBadgeSelect from "./filter/FilterBadgeSelect"
import GlobalSearchResult from "./GlobalSearchResult"

type TProps = {
  globalSearchBarRef: MutableRefObject<HTMLDivElement | null>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const GlobalSearchDialog = ({
  globalSearchBarRef,
  search,
  setSearch,
  setIsOpen,
}: TProps) => {
  const dialogBoxRef = useRef<HTMLDivElement | null>(null)

  const { searchParam: globalFilter, setSearchParam: setGlobalFilter } =
    useQueryParams({
      queryParamName: "globalFilter",
      debounceDelay: 0,
    })

  // click outside GlobalSearchBar | DialogBox => remove global query param + close dialog
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!globalSearchBarRef?.current || !dialogBoxRef?.current) return

      if (
        !globalSearchBarRef.current.contains(e.target as Node) &&
        !dialogBoxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setSearch("")
      }
    }

    document.addEventListener("click", (e) => handleClickOutside(e), true)

    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  }, [globalSearchBarRef, setIsOpen, setSearch])

  return (
    <div
      ref={dialogBoxRef}
      className="background-light800_dark400 absolute left-1/2 top-16 min-h-64 min-w-[624px] -translate-x-1/2 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <span className="text-dark100_light900">Filters</span>

        <FilterBadgeSelect
          filter={globalFilter}
          setFilter={setGlobalFilter}
          // eslint-disable-next-line camelcase
          options={GLOBAL_FILTER_OPTIONS}
          wrapperClassName="w-full flex flex-wrap max-md:hidden md:my-4 gap-4"
          className="max-md:h-16 md:h-10"
        />
      </div>

      <GlobalSearchResult setIsOpen={setIsOpen} />
    </div>
  )
}

export default GlobalSearchDialog

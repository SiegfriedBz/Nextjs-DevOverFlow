"use client"

import SearchBarInput from "@/components/shared/search/SearchBarInput"
import useQueryParams from "@/hooks/useQueryParams"
import { useRef, useState } from "react"
import GlobalSearchDialog from "./GlobalSearchDialog"

const GlobalSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { searchParam: search, setSearchParam: setSearch } = useQueryParams({
    queryParamName: "globalQ",
    debounceDelay: 750,
  })

  const globalSearchBarRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="relative w-full">
      <div ref={globalSearchBarRef} className="size-full">
        <SearchBarInput
          // GlobalSearchBar props
          isGlobalSearch={true}
          globalDialogIsOpen={isOpen}
          setGlobalDialogIsOpen={setIsOpen}
          // rest of props
          search={search}
          setSearch={setSearch}
          placeholder="Search globally"
          wrapperClassName="flex-1 max-md:hidden"
        />
      </div>

      {isOpen && (
        <GlobalSearchDialog
          globalSearchBarRef={globalSearchBarRef}
          search={search}
          setIsOpen={setIsOpen}
          setSearch={setSearch}
        />
      )}
    </div>
  )
}

export default GlobalSearchBar

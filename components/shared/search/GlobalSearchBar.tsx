"use client"

import useQueryParams from "@/hooks/useQueryParams"
import SearchBarInput from "./SearchBarInput"

const GlobalSearchBar = () => {
  const [search, setSearch] = useQueryParams({ queryParamName: "globalQ" })

  return (
    <SearchBarInput
      search={search}
      setSearch={setSearch}
      placeholder="Search globally"
      isLocal={false}
      wrapperClassName="flex-1"
    />
  )
}

export default GlobalSearchBar

"use client"

import useQueryParams from "@/hooks/useQueryParams"
import SearchBarInput from "./SearchBarInput"

const LocalSearchBar = () => {
  const [search, setSearch] = useQueryParams({ queryParamName: "q" })

  return (
    <SearchBarInput
      search={search}
      setSearch={setSearch}
      placeholder="Search questions..."
    />
  )
}

export default LocalSearchBar

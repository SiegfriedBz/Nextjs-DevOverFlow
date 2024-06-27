"use client"

import useQueryParams from "@/hooks/useQueryParams"
import SearchBarInput from "./SearchBarInput"

type TProps = {
  queryParamName: string
  placeholder: string
}
const LocalSearchBar = ({ queryParamName, placeholder }: TProps) => {
  const [search, setSearch] = useQueryParams({ queryParamName })

  return (
    <SearchBarInput
      search={search}
      setSearch={setSearch}
      placeholder={placeholder}
    />
  )
}

export default LocalSearchBar

"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { useDebounce } from "use-debounce"

type TProps = {
  queryParamName: string
  debounceDelay?: number
}

const useQueryParams = ({ queryParamName, debounceDelay = 1000 }: TProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [search, setSearch] = useState(() => {
    // init input field value on component mount (fetch value from URL)
    const queryParams = new URLSearchParams(searchParams)
    const initSearch = queryParams.get(queryParamName)
    return initSearch || ""
  })
  const [value] = useDebounce(search, debounceDelay)

  const getQueryString = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      const queryParams = new URLSearchParams(searchParams)
      if (!value) {
        queryParams.delete(name)
      } else {
        queryParams.set(name, value)
      }

      return queryParams.toString()
    },
    [searchParams]
  )

  // update URL state (searchParams) onChange input
  useEffect(() => {
    const queryString = getQueryString({ name: queryParamName, value })

    router.push(`${pathname}?${queryString}`)
    router.refresh()
  }, [queryParamName, value, pathname, getQueryString, router])

  return [search, setSearch] as const
}

export default useQueryParams

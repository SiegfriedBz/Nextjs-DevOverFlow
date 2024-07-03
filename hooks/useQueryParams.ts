"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "use-debounce"

type TProps = {
  queryParamName: string
  debounceDelay?: number
}

const useQueryParams = ({ queryParamName, debounceDelay = 1000 }: TProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [searchParam, setSearchParam] = useState(() => {
    // init input field value on component mount (fetch value from URL)
    const queryParams = new URLSearchParams(searchParams)
    const initSearch = queryParams.get(queryParamName)
    return initSearch || ""
  })

  const [value] = useDebounce(searchParam, debounceDelay)

  const getQueryString = useCallback(
    ({ name, value }: { name: string; value: string }) => {
      const queryParams = new URLSearchParams(searchParams)
      if (!value) {
        queryParams.delete(name)
        setSearchParam("")
      } else {
        // if ?page=1 delete from url
        if (name === "page" && value === "1") {
          queryParams.delete(name)
        } else {
          queryParams.set(name, value?.toLowerCase().split(" ").join("_"))
        }
        setSearchParam(value)
      }

      return queryParams.toString()
    },
    [searchParams]
  )

  // update URL state (searchParams) onChange input
  useEffect(() => {
    const queryString = getQueryString({ name: queryParamName, value })

    // TODO FIX - scroll: true if queryParamName === "page"
    router.push(`${pathname}?${queryString}`, {
      scroll: false,
    })
    // router.refresh()
  }, [queryParamName, value, pathname, getQueryString, router])

  return { searchParam, setSearchParam } as const
}

export default useQueryParams

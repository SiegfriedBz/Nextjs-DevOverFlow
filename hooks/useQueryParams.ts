"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { useDebounce } from "use-debounce"

type TProps = {
  queryParamName: string
  debounceDelay?: number
}

const useQueryParams = ({ queryParamName, debounceDelay = 1000 }: TProps) => {
  const [search, setSearch] = useState("")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
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

  useEffect(() => {
    const queryString = getQueryString({ name: queryParamName, value })

    router.push(`${pathname}?${queryString}`)
  }, [queryParamName, value, pathname, getQueryString, router])

  return [search, setSearch] as const
}

export default useQueryParams

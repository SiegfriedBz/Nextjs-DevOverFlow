"use client"

import { Button } from "@/components/ui/button"
import useQueryParams from "@/hooks/useQueryParams"
import { usePathname } from "next/navigation"

type TProps = {
  hasNextPage: boolean
}
const Pagination = ({ hasNextPage = true }: TProps) => {
  const { searchParam: page, setSearchParam: setPage } = useQueryParams({
    queryParamName: "page",
    debounceDelay: 0,
  })

  const pathname = usePathname()
  const isPaginated = !pathname.includes("/ask-question")
  if (!isPaginated) return null

  const pageNum = (page && parseInt(page, 10)) || 1

  if (!hasNextPage && pageNum === 1) return null

  const handleNavigate = (dir: "prev" | "next") => {
    if (dir === "prev") {
      if (pageNum <= 1) return

      setPage((prev) => {
        return String(parseInt(prev, 10) - 1)
      })
    }

    if (dir === "next") {
      setPage((prev) => {
        return prev ? String(parseInt(prev, 10) + 1) : "2"
      })
    }
  }

  const prevIsDisabled = isNaN(pageNum) || pageNum <= 1
  const nextIsDisabled = !hasNextPage

  return (
    <div className="mx-auto flex items-center justify-center">
      <Button
        disabled={prevIsDisabled}
        onClick={() => handleNavigate("prev")}
        className="light-border-2 btn flex h-8 items-center justify-center gap-2 border"
      >
        <span className="body-medium text-dark200_light800">Prev</span>
      </Button>
      <div className="mx-1 flex h-8 min-w-8 items-center justify-center rounded-md bg-primary-500 px-4 py-2">
        <span className="body-semibold text-light-900">{pageNum || 1}</span>
      </div>
      <Button
        disabled={nextIsDisabled}
        onClick={() => handleNavigate("next")}
        className="light-border-2 btn flex h-8 items-center justify-center gap-2 border"
      >
        <span className="body-medium text-dark200_light800">Next</span>
      </Button>
    </div>
  )
}

export default Pagination

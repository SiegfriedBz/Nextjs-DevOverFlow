"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import React from "react"

type TProps = {
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
  options: string[]
  wrapperClassName?: string
  className?: string
}

const FilterBadgeSelect = ({
  filter,
  setFilter,
  options,
  wrapperClassName,
  className,
}: TProps) => {
  return (
    <ul className={wrapperClassName}>
      {options.map((option) => {
        const isActiveOption =
          option.toLowerCase() === filter?.toLowerCase().split("_").join(" ")

        return (
          <Button
            size="noPx"
            onClick={() => setFilter(option)}
            key={`badge-${option}`}
          >
            <Badge
              className={`body-medium 
                  ${className} 
                  ${
                    isActiveOption
                      ? "bg-primary-100 text-primary-500"
                      : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-200"
                  }  body-regular light-border flex items-center justify-center rounded-xl border-none px-4 py-2.5`}
            >
              {option}
            </Badge>
          </Button>
        )
      })}
      <Button
        size="noPx"
        onClick={() => setFilter("")}
        className="rounded-xl border border-light-500"
      >
        <Badge
          className={`body-medium body-regular light-border flex items-center justify-center rounded-xl border-none bg-light-800 px-4
            py-2.5 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-200`}
        >
          Clear
        </Badge>
      </Button>
    </ul>
  )
}

export default FilterBadgeSelect

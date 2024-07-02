"use client"
import {
  Select,
  SelectContent,
  // SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react"

type TProps = {
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
  options: string[]
  wrapperClassName?: string
  className?: string
}

const FilterCustomSelect = ({
  filter,
  setFilter,
  options,
  wrapperClassName,
  className,
}: TProps) => {
  return (
    <div className={wrapperClassName}>
      <Select onValueChange={setFilter}>
        <SelectTrigger
          className={`${className} text-dark500_light700 body-regular light-border background-light800_dark300 w-full rounded-xl border-none px-4 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {/* <SelectGroup> */}
          {options.map((option) => {
            const isActiveOption =
              option.toLowerCase() ===
              filter?.toLowerCase().split("_").join(" ")

            return (
              <SelectItem
                className={`${isActiveOption ? "bg-accent text-accent-foreground" : ""}`}
                key={`option-${option}`}
                value={option}
              >
                {option}
              </SelectItem>
            )
          })}
          {/* </SelectGroup> */}
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterCustomSelect

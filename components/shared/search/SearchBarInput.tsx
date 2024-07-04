import { Input } from "@/components/ui/input"
import { cn } from "@/lib/shadcn.utils"
import Image from "next/image"
import React from "react"

type TProps = {
  // GlobalSearchBar props
  isGlobalSearch?: boolean
  globalDialogIsOpen?: boolean
  setGlobalDialogIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  // rest of props
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
  iconName?: string
  iconPosition?: "left" | "right"
  wrapperClassName?: string
  className?: string
}
const SearchBarInput = ({
  isGlobalSearch = false,
  globalDialogIsOpen,
  setGlobalDialogIsOpen,
  search,
  setSearch,
  placeholder,
  iconName = "search",
  iconPosition = "left",
  wrapperClassName = "",
  className = "",
}: TProps) => {
  return (
    <div className={cn("relative w-full rounded-xl", wrapperClassName)}>
      <div
        className={`
            background-light800_darkgradient
            relative 
            ${iconPosition === "left" ? "flex" : "flex-row-reverse"} 
            ${className}
            size-full h-16 grow items-center gap-4 rounded-xl px-4`}
      >
        <Image
          src={`/assets/icons/${iconName}.svg`}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            if (isGlobalSearch) {
              if (!globalDialogIsOpen) {
                return (
                  setGlobalDialogIsOpen as React.Dispatch<
                    React.SetStateAction<boolean>
                  >
                )(true)
              } else if (globalDialogIsOpen && e.target.value.trim() === "") {
                return (
                  setGlobalDialogIsOpen as React.Dispatch<
                    React.SetStateAction<boolean>
                  >
                )(false)
              }
            }
          }}
          type="text"
          placeholder={placeholder}
          className="paragraph-regular 
            no-focus 
            background-light800_darkgradient
            text-dark400_light700
            placeholder
            border-none
            p-4
            shadow-none
            outline-none
          "
        />
      </div>
    </div>
  )
}

export default SearchBarInput

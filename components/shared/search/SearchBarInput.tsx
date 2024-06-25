import { Input } from "@/components/ui/input"
import Image from "next/image"
import React from "react"

type TProps = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
  isLocal?: boolean
  iconName?: string
  iconPosition?: "left" | "right"
  className?: string
}
const SearchBarInput = ({
  search,
  setSearch,
  placeholder,
  isLocal = true,
  iconName = "search",
  iconPosition = "left",
  className = "",
}: TProps) => {
  return (
    <div className="relative w-full rounded-xl">
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
          onChange={(e) => setSearch(e.target.value)}
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

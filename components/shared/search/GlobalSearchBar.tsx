"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"

const GlobalSearchBar = () => {
  const [search, setSearch] = useState("")
  console.log("search", search)

  return (
    <div className="relative w-full max-w-[600px] rounded-xl max-lg:hidden">
      <div className="background-light800_darkgradient relative flex size-full h-16 grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search globally"
          className="paragraph-regular 
            no-focus 
            background-light800_darkgradient
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

export default GlobalSearchBar

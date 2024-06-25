import { cn } from "@/lib/utils"
import React from "react"

type TProps = {
  className?: string
  children: React.ReactNode
}

const SideBar = ({ className = "", children }: TProps) => {
  return (
    <section
      className={cn(
        `background-light900_dark200 
        flex  
        flex-col px-8
        pb-4 pt-20 shadow-light-300 dark:shadow-none
      `,
        className
      )}
    >
      {children}
    </section>
  )
}

export default SideBar

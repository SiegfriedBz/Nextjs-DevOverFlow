import React from "react"

type TProps = {
  className?: string
  children: React.ReactNode
}

const SideBar = ({ className = "", children }: TProps) => {
  return (
    <section
      className={`${className} background-light900_dark200 
        custom-scrollbar flex
        min-h-[90vh] flex-col overflow-y-auto px-8
        pb-4 pt-20 shadow-light-300 dark:shadow-none
      `}
    >
      {children}
    </section>
  )
}

export default SideBar

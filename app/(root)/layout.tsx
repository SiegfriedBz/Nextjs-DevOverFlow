import Navbar from "@/components/shared/navbar/Navbar"
import LeftSideBar from "@/components/shared/navbar/sidebar/LeftSideBar"
import RightSidebar from "@/components/shared/navbar/sidebar/RightSidebar"

import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="mt-[56px] max-sm:hidden">
          <LeftSideBar />
        </div>

        <section className="flex h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl overflow-y-auto">
            {children}
          </div>
        </section>

        <div className="mt-[56px] max-xl:hidden">
          <RightSidebar />
        </div>
      </div>
    </main>
  )
}

export default layout

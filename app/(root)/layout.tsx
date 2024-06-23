import LeftSideBar from "@/components/shared/navbar/LeftSideBar"
import Navbar from "@/components/shared/navbar/Navbar"
import RightSidebar from "@/components/shared/navbar/RightSidebar"
import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <div className="mt-6 max-sm:hidden">
          <LeftSideBar />
        </div>

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        {/* TODO max-sm:hidden ? */}
        <RightSidebar />
      </div>
    </main>
  )
}

export default layout

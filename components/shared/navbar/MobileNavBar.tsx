"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import Image from "next/image"
import LogoLink from "./LogoLink"
import { useState } from "react"
import LeftSideBar from "./sidebar/LeftSideBar"

const MobileNavBar = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="mobile menu button"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <VisuallyHidden.Root>
          <SheetTitle>Left Sidebar</SheetTitle>
          <SheetDescription>Left Sidebar</SheetDescription>
        </VisuallyHidden.Root>

        <LogoLink />

        <div className="flex h-full flex-col">
          <LeftSideBar isMobileSideBar={true} setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavBar

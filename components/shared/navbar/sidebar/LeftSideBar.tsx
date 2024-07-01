"use client"

import { LEFTSIDEBAR_LINKS } from "@/constants"
import type { ISidebarLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import AuthButtons from "../AuthButtons"
import SideBar from "./Sidebar"
import { useUser } from "@clerk/nextjs"

type TProps =
  | {
      isMobileSideBar?: boolean
      setOpen?: () => void
    }
  | { isMobileSideBar: boolean; setOpen: Dispatch<SetStateAction<boolean>> }

const LeftSideBar = ({
  isMobileSideBar = false,
  setOpen = () => {},
}: TProps) => {
  const { user } = useUser()
  const clerkId = user?.id

  return (
    <SideBar
      className={`h-[calc(100vh-3rem)]
        ${
          isMobileSideBar
            ? `custom-scrollbar
                overflow-y-auto px-4 pt-8`
            : "lg:w-[266px]"
        }
      `}
    >
      {/* left-side-bar links  */}
      <ul className={`flex h-full flex-col gap-4`}>
        {LEFTSIDEBAR_LINKS.map((link) => {
          if (link.href === "/profile" && clerkId) {
            link.href = `/profile/${clerkId}`
          }
          if (link.href === "/profile" && !clerkId) {
            return null
          }
          return (
            <li key={`mobileNavContent-${link.label}`}>
              <CustomNavLink
                isMobileSideBar={isMobileSideBar}
                link={link}
                setOpen={setOpen}
              />
            </li>
          )
        })}
      </ul>

      <AuthButtons isMobileSideBar={isMobileSideBar} />
    </SideBar>
  )
}

export default LeftSideBar

type TCustomNavLinkProps = TProps & {
  link: ISidebarLink
}
const CustomNavLink = ({
  isMobileSideBar = false,
  link,
  setOpen,
}: TCustomNavLinkProps) => {
  const { imgURL, href, label } = link
  const pathname = usePathname()

  const isActive =
    (href !== "/" && pathname.includes(href)) || pathname === href

  return (
    <Link
      onClick={() =>
        isMobileSideBar
          ? (setOpen as Dispatch<SetStateAction<boolean>>)(false)
          : {}
      }
      href={href}
      className={`flex w-full items-center justify-start gap-4
        bg-transparent
        ${isMobileSideBar ? "p-2" : "p-4"}
        ${
          isActive
            ? "primary-gradient rounded-xl text-light-900"
            : "text-dark300_light900"
        }`}
    >
      <Image
        src={imgURL}
        width={20}
        height={20}
        alt={label}
        className={isActive ? "" : "invert-colors"}
      />
      <p
        className={`whitespace-nowrap ${!isMobileSideBar && "max-lg:hidden"} ${isActive ? "base-bold" : "base-medium"}`}
      >
        {label}
      </p>
    </Link>
  )
}

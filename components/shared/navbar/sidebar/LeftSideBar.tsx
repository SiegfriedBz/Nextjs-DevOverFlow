"use client"

import { LEFTSIDEBAR_LINKS } from "@/constants"
import type { ISidebarLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import AuthButtons from "../AuthButtons"
import SideBar from "./Sidebar"

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
  return (
    <SideBar className={isMobileSideBar ? "" : "lg:w-[266px]"}>
      {/* left-side-bar links  */}
      <ul className="flex h-full flex-col gap-4">
        {LEFTSIDEBAR_LINKS.map((link) => {
          return (
            <li key={`mobileNavContent-${link.label}`}>
              <CustomNavLink
                link={link}
                isMobileSideBar={isMobileSideBar}
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
  link,
  isMobileSideBar,
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
      className={`flex w-full items-center justify-start gap-4 bg-transparent p-4
                ${
                  isActive
                    ? "primary-gradient rounded-lg text-light-900"
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
        className={`${!isMobileSideBar && "max-lg:hidden"} ${isActive ? "base-bold" : "base-medium"}`}
      >
        {label}
      </p>
    </Link>
  )
}

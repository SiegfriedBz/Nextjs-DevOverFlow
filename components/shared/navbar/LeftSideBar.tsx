"use client"

import { LEFTSIDEBAR_LINKS } from "@/constants"
import { SidebarLink } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LeftSideBar = () => {
  const pathname = usePathname()

  console.log(LEFTSIDEBAR_LINKS)
  const linkO = LEFTSIDEBAR_LINKS.at(0) as SidebarLink
  console.log(linkO.imgURL)

  return (
    <section className="flex-1 pt-16">
      <ul className="flex flex-col gap-4">
        {LEFTSIDEBAR_LINKS.map((link) => {
          const { imgURL, href, label } = link
          const isActive = pathname.includes(href) || pathname === href

          return (
            <Link
              key={`mobileNavContent-${label}`}
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
              <p className={isActive ? "base-bold" : "base-medium"}>{label}</p>
            </Link>
          )
        })}
      </ul>
    </section>
  )
}

export default LeftSideBar

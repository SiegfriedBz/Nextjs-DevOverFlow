import Image from "next/image"
import Link from "next/link"
import React from "react"

type TProps = {
  imgUrl: string
  label: string
  href?: string
  target?: string
}
const ProfileLink = ({ imgUrl, label, href, target }: TProps) => {
  const linkProps =
    target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <div className="paragraph-medium flex-center gap-2">
      <Image src={imgUrl} width={20} height={20} alt="icon" />
      {href ? (
        <Link href={href} {...linkProps} className="text-accent-blue">
          {label}
        </Link>
      ) : (
        <span className="text-dark400_light700">{label}</span>
      )}
    </div>
  )
}

export default ProfileLink

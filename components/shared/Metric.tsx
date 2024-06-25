import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Metric = ({
  href,
  imageSrc,
  alt,
  value,
  title,
  isAuthor = false,
  className = "small-medium text-dark400_light800",
}: {
  href?: string
  imageSrc: string
  alt: string
  value: string | number
  title: string
  isAuthor?: boolean
  className?: string
}) => {
  const content = (
    <div className={`${className} flex flex-wrap items-center gap-x-1`}>
      <Image
        src={imageSrc}
        width={16}
        height={16}
        alt={alt}
        className="invert-colors"
      />
      <p className={`${isAuthor && href ? "max-sm:hidden" : ""}`}>
        <span>{typeof value === "number" ? formatNumber(value) : value}</span>
        <span>{title}</span>
      </p>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <>{content}</>
      </Link>
    )
  }

  return content
}

export default Metric

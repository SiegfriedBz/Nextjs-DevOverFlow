import { cn } from "@/lib/shadcn.utils"
import { formatNumber } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type TProps = {
  href?: string
  imageSrc: string
  alt: string
  value: string | number
  title?: string
  isAuthor?: boolean
  className?: string
  paragraphClassName?: string
}
const Metric = ({
  href,
  imageSrc,
  alt,
  value,
  title,
  isAuthor = false,
  className = "",
  paragraphClassName = "",
}: TProps) => {
  const content = (
    <div
      className={cn(
        `small-medium text-dark400_light800 flex flex-wrap items-center gap-x-1
          ${isAuthor && href ? "max-sm:hidden" : ""}
        `,
        className
      )}
    >
      <Image
        src={imageSrc}
        width={16}
        height={16}
        alt={alt}
        className={`${href ? "rounded-full" : ""} invert-colors`}
      />
      <p className={cn(`font-light`, paragraphClassName)}>
        <span>{typeof value === "number" ? formatNumber(value) : value}</span>
        {title && <span>{title}</span>}
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

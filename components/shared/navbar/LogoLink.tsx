import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type TProps = {
  className?: string
}
const LogoLink = ({ className = "" }: TProps) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevFlow"
      />

      <p
        className={cn(
          "h2-bold text-dark100_light900 font-spaceGrotesk",
          className
        )}
      >
        Dev <span className="text-primary-500">OverFlow</span>
      </p>
    </Link>
  )
}

export default LogoLink

import { cn } from "@/lib/shadcn.utils"
import Image from "next/image"
import Link from "next/link"

type TProps = {
  className?: string
}
const LogoLink = ({ className = "" }: TProps) => {
  return (
    <Link href="/" className="flex items-center gap-1 sm:mr-4">
      <Image
        src="/assets/images/site-logo.svg"
        width={24}
        height={24}
        alt="DevFlow"
      />

      <h2
        className={cn(
          "h2-bold text-dark100_light900 font-spaceGrotesk whitespace-nowrap",
          className
        )}
      >
        Dev <span className="text-primary-500">OverFlow</span>
      </h2>
    </Link>
  )
}

export default LogoLink

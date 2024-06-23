import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import Image from "next/image"
import Link from "next/link"
import LeftSideBar from "./LeftSideBar"
import LogoLink from "./LogoLink"

const MobileNavBar = () => {
  return (
    <Sheet>
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
          <LeftSideBar />

          <div>
            <SignedOut>
              <div className="flex flex-col gap-3">
                {/* log in */}
                <SignButton
                  label="Log in"
                  href="/sign-in"
                  className="btn-secondary primary-text-gradient"
                />
                {/* sign up */}
                <SignButton
                  label="Sign up"
                  href="/sign-up"
                  className="light-border-2 btn-tertiary text-dark400_light900"
                />
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavBar

const SignButton = ({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className: string
}) => {
  return (
    <Button
      asChild
      className={cn(
        "small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none",
        className
      )}
    >
      <Link href={href}>
        <span className="w-full text-center">{label}</span>
      </Link>
    </Button>
  )
}

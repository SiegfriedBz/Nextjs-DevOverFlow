import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

type TProps = {
  isMobileSideBar?: boolean
}
const AuthButtons = ({ isMobileSideBar }: TProps) => {
  console.log("AuthButtons isMobileSideBar", isMobileSideBar)
  return (
    <>
      <SignedOut>
        <div className="flex flex-col gap-3">
          {/* log in */}
          <SignButton
            isMobileSideBar={isMobileSideBar}
            icon="/assets/icons/account.svg"
            label="Login"
            href="/sign-in"
            className="btn-secondary primary-text-gradient"
          />
          {/* sign up */}
          <SignButton
            isMobileSideBar={isMobileSideBar}
            icon="/assets/icons/sign-up.svg"
            label="Sign up"
            href="/sign-up"
            className="light-border-2 btn-tertiary text-dark400_light900"
          />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="py-3">
          {/* log out */}
          <SignOutButton>
            <Button className="text-dark300_light900 mx-auto flex items-center gap-4">
              <Image
                src="/assets/icons/sign-up.svg"
                width={20}
                height={20}
                alt="log-out"
                className="invert-colors"
              />
              <p
                className={`base-medium ${!isMobileSideBar && "max-lg:hidden"}`}
              >
                Log out
              </p>
            </Button>
          </SignOutButton>
        </div>
      </SignedIn>
    </>
  )
}

export default AuthButtons

type TSignButtonProps = {
  icon: string
  href: string
  label: string
  className: string
  isMobileSideBar?: boolean
}
const SignButton = ({
  icon,
  href,
  label,
  className,
  isMobileSideBar = false,
}: TSignButtonProps) => {
  return (
    <Button
      asChild
      className={cn(
        "small-medium min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none",
        className
      )}
    >
      <Link href={href}>
        <Image
          src={icon}
          width={20}
          height={20}
          alt={label}
          className={`${isMobileSideBar ? "hidden" : "lg:hidden"}`}
        />
        <span
          className={`w-full text-center text-base 
            ${isMobileSideBar ? "" : "max-lg:hidden"}
          `}
        >
          {label}
        </span>
      </Link>
    </Button>
  )
}

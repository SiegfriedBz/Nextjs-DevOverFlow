import GlobalSearchBar from "@/components/shared/search/GlobalSearchBar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import LogoLink from "./LogoLink"
import MobileNavBar from "./MobileNavBar"
import SwitchThemeButton from "./SwitchThemeButton"

const Navbar = () => {
  return (
    <header className="background-light900_dark200 flex-between shadow-light300_darknone fixed z-50 h-24 w-full gap-x-4 p-6 sm:px-12">
      <LogoLink className="max-md:hidden" />

      <GlobalSearchBar />

      <div className="flex-between max-sm:gap-3 sm:gap-5">
        <SwitchThemeButton />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: "w-10 h-10" },
              variables: { colorPrimary: "#ff7000" },
            }}
          />
        </SignedIn>

        <MobileNavBar />
      </div>
    </header>
  )
}

export default Navbar

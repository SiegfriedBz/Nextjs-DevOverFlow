import GlobalSearchBar from "@/components/GlobalSearchBar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import LogoLink from "./LogoLink"
import MobileNavBar from "./MobileNavBar"
import SwitchThemeButton from "./SwitchThemeButton"

const Navbar = () => {
  return (
    <header className="background-light900_dark200 flex-between shadow-light300_darknone fixed z-50 w-full p-6 sm:px-12">
      <GlobalSearchBar />

      <LogoLink className="max-sm:hidden" />

      <div className="flex-between gap-5">
        <SwitchThemeButton />

        <div className="max-sm:hidden">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "w-10 h-10" },
                variables: { colorPrimary: "#ff7000" },
              }}
            />
          </SignedIn>
        </div>

        <MobileNavBar />
      </div>
    </header>
  )
}

export default Navbar

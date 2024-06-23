import SwitchThemeButton from "@/components/SwitchThemeButton"
import GlobalSearchBar from "@/components/GlobalSearchBar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import MobileNavBar from "./MobileNavBar"

const NAVBAR_LINKS = [
  { id: 1, label: "About", href: "/", image: "", alt: "DevFlow" },
]
const Navbar = () => {
  return (
    <header className="background-light900_dark200 flex-between shadow-light300_darknone  fixed z-50 w-full gap-5 p-6  sm:px-12">
      <GlobalSearchBar />

      <Logo />

      <nav className="ms-auto">
        <ul className="flex-between">
          {NAVBAR_LINKS?.map((link) => {
            const { id, href, label, image, alt } = link

            return (
              <li key={id}>
                <Link href={href} className="flex items-center gap-1">
                  <Image src={image} width={23} height={23} alt={alt} />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-between gap-5">
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
      </div>

      <MobileNavBar />
    </header>
  )
}

export default Navbar

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevFlow"
      />
      <p className="h2-bold text-dark100_light900 font-spaceGrotesk max-sm:hidden">
        Dev <span className="text-primary-500">OverFlow</span>
      </p>
    </Link>
  )
}

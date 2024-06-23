import {
  ClerkProvider,
  // SignedIn,
  // SignedOut,
  // SignInButton,
  // UserButton,
} from "@clerk/nextjs"
import React from "react"

const CustomClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider
    appearance={{
      elements: {
        formButtonPrimary: "primary-gradient",
        footerActionLink: "primary-text-gradient hover:text-primary-500",
      },
    }}
  >
    {/* <SignInButton />
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn> */}
    {children}
  </ClerkProvider>
)

export default CustomClerkProvider

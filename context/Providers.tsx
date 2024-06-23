import React from "react"
import ThemeContextProvider from "./ThemeContextProvider"
import CustomClerkProvider from "./ClerkProvider"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CustomClerkProvider>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </CustomClerkProvider>
  )
}

export default Providers

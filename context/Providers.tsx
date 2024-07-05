import { Toaster } from "@/components/ui/sonner"
import React from "react"
import CustomClerkProvider from "./ClerkProvider"
import ThemeContextProvider from "./ThemeContextProvider"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CustomClerkProvider>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </CustomClerkProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "class",
          classNames: {
            error:
              "opacity-100 z-[9999] bg-red-500 flex items-center w-fit px-4 py-2",
            success:
              "opacity-100 z-[9999] text-primary-500 flex items-center w-fit px-4 py-2",
            warning:
              "opacity-100 z-[9999] text-yellow-400 flex items-center w-fit px-4 py-2",
            info: "opacity-100 z-[9999] bg-blue-400 flex items-center w-fit px-4 py-2",
          },
        }}
      />
    </>
  )
}

export default Providers

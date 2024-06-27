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
          unstyled: true,
          style: {
            zIndex: 9999,
            border: "1px solid #FF7000",
            borderRadius: "5px",
          },
          className: "class",
          classNames: {
            error: "bg-red-500 flex items-center w-fit px-4 py-2",
            success: "text-primary-500 flex items-center w-fit px-4 py-2",
            warning: "text-yellow-400 flex items-center w-fit px-4 py-2",
            info: "bg-blue-400 flex items-center  w-fit px-4 py-2",
          },
        }}
      />
    </>
  )
}

export default Providers

"use client"

import { useContext } from "react"
import { ThemeContext } from "@/context/ThemeContextProvider"

const useThemeContext = () => {
  if (!useContext(ThemeContext)) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    )
  }
  return useContext(ThemeContext)
}

export default useThemeContext

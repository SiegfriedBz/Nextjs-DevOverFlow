"use client"

import type { TTheme } from "@/constants"
import useLocalStorage from "@/hooks/useLocalStorage"
import React, { createContext, useEffect } from "react"

const LOCALSTORAGE_THEME_KEY = "devflow-theme"

export type TThemeContext = {
  theme: TTheme["value"]
  setTheme: React.Dispatch<React.SetStateAction<TThemeContext["theme"]>>
}
export const ThemeContext = createContext<TThemeContext | null>(null)

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<TThemeContext["theme"]>({
    key: LOCALSTORAGE_THEME_KEY,
    initialValue: "dark",
  })

  useEffect(() => {
    const userPrefersDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    if (
      theme === "dark" ||
      (!(LOCALSTORAGE_THEME_KEY in localStorage) && userPrefersDarkTheme)
    ) {
      document.documentElement.classList.add("dark")
    } else if (
      theme === "light" ||
      (!(LOCALSTORAGE_THEME_KEY in localStorage) && !userPrefersDarkTheme)
    ) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.toggle("dark", userPrefersDarkTheme)
    }
  }, [theme])

  console.log("RENDER ThemeContextProvider theme", theme)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider

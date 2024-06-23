"use client"

import useLocalStorage from "@/hooks/useLocalStorage"
import React, { createContext, useEffect } from "react"

export type TThemeContext = {
  theme: "light" | "dark"
  handleThemeChange: () => void
}
export const ThemeContext = createContext<TThemeContext | null>(null)

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<TThemeContext["theme"]>({
    key: "devflow-theme",
    initialValue: "dark",
  })

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  console.log("theme", theme)

  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider

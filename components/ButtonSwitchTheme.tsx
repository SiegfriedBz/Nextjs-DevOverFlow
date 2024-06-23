"use client"

import type { TThemeContext } from "@/context/ThemeContextProvider"
import useThemeContext from "@/hooks/useThemeContext"

const ButtonSwitchTheme = () => {
  const context = useThemeContext()
  const { handleThemeChange } = context as TThemeContext

  return (
    <button className="text-orange-500" onClick={handleThemeChange}>
      SWITCH
    </button>
  )
}

export default ButtonSwitchTheme

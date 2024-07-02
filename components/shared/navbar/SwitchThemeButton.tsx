"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { THEMES } from "@/constants"
import type { TThemeContext } from "@/context/ThemeContextProvider"
import useThemeContext from "@/hooks/useThemeContext"
import type { TTheme } from "@/types"
import Image from "next/image"

const lightTheme = THEMES.find((t) => t.value === "light") as TTheme
const darkTheme = THEMES.find((t) => t.value === "dark") as TTheme
const systemTheme = THEMES.find((t) => t.value === "system") as TTheme

const SwitchThemeButton = () => {
  const context = useThemeContext()
  const { theme, setTheme } = context as TThemeContext

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200"
      >
        <Button size="icon" className="border-none">
          <Image
            src={
              theme === "light"
                ? lightTheme.icon
                : theme === "dark"
                  ? darkTheme.icon
                  : systemTheme.icon
            }
            alt={theme}
            width={24}
            height={24}
            className="active-theme"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="relative flex -translate-x-2 flex-col gap-y-2 rounded-md border bg-light-900 p-2 dark:border-dark-400 dark:bg-dark-300 dark:text-light-400"
      >
        {THEMES.map((t) => {
          const { value, label, icon } = t

          return (
            <DropdownMenuItem
              key={label}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-x-4 font-semibold ${theme === value ? "active-theme" : ""}`}
            >
              <Image src={icon} alt={label} width={16} height={16} />
              {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SwitchThemeButton

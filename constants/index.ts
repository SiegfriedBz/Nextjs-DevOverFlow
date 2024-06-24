import type { ISidebarLink } from "@/types/index"

export type TTheme = {
  value: "light" | "dark" | "system"
  label: string
  icon: string
}
export const THEMES: TTheme[] = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
]

export const LEFTSIDEBAR_LINKS: ISidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    href: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    href: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    href: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    href: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    href: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    href: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    href: "/ask-question",
    label: "Ask a question",
  },
]

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
}

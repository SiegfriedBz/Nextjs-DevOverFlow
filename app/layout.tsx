import type { Metadata } from "next"
import { Inter, Space_Grotesk as spaceGrotesk } from "next/font/google"
import React from "react"
import "./globals.css"
import Providers from "@/context/Providers"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})
const grotesk = spaceGrotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
})

export const metadata: Metadata = {
  title: "DevFlow",
  description: "A community-driven platform for developers",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${grotesk.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

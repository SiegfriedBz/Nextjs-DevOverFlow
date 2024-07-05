import Providers from "@/context/Providers"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk as spaceGrotesk } from "next/font/google"
import React from "react"
import "./globals.css"
import "./prism.css"

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
  title: "Dev OverFlow",
  description: "A community-driven platform for developers",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "Dev OverFlow",
    title: "Dev OverFlow",
    description: "A community-driven platform for developers",
    images: [
      {
        url: process.env.NEXT_PUBLIC_IMG_CLOUDINARY_URL as string,
        width: 1200,
        height: 630,
        alt: "Dev OverFlow",
      },
    ],
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
        <Analytics />
      </body>
    </html>
  )
}

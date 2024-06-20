import React from "react"

type TProps = {
  children: React.ReactNode
}
const layout = ({ children }: TProps) => {
  return <main className="flex-center min-h-screen w-full">{children}</main>
}

export default layout

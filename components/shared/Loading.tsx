import { cn } from "@/lib/shadcn.utils"
import React from "react"

type TProps = {
  className?: string
}
const Loading = ({ className = "" }: TProps) => {
  return <div className={cn("z-[9999] loader my-8", className)} />
}

export default Loading

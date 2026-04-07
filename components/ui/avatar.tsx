import * as React from "react"

export function Avatar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function AvatarImage({
  src,
  alt = "",
  className = "",
}: {
  src: string
  alt?: string
  className?: string
}) {
  return <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} />
}

export function AvatarFallback({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gray-300 text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </div>
  )
}

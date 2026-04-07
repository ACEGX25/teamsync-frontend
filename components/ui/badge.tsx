import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "secondary" | "destructive"
}

const variantStyles = {
  default: "bg-primary text-primary-foreground",
  outline: "border border-gray-300 bg-white text-gray-900",
  secondary: "bg-gray-100 text-gray-900",
  destructive: "bg-red-500 text-white",
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }

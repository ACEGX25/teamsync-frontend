import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: `${children.props.className || ""} px-4 py-2 rounded-md font-medium transition-colors hover:bg-gray-100 ${className}`,
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-md font-medium transition-colors hover:bg-gray-100 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }

import * as React from "react"

interface DropdownContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextProps | undefined>(undefined)

function useDropdown() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error("useDropdown must be used within DropdownMenu")
  }
  return context
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  className = "",
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen } = useDropdown()

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>
    return React.cloneElement(childElement, {
      onClick: (e: any) => {
        setOpen(true)
        childElement.props?.onClick?.(e)
      },
      ...props,
    })
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-10 w-10 ${className}`}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open, setOpen } = useDropdown()

  React.useEffect(() => {
    if (!open) return
    const handleClick = () => setOpen(false)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      className={`absolute right-0 z-50 min-w-[200px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-md ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  const { setOpen } = useDropdown()
  return (
    <button
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${className}`}
      onClick={(e) => {
        setOpen(false)
        props.onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuLabel({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-4 py-2 text-xs font-semibold text-gray-500 ${className}`}>{children}</div>
}

export function DropdownMenuSeparator({ className = "" }: { className?: string }) {
  return <div className={`my-1 h-px bg-gray-200 ${className}`} />
}

export function DropdownMenuGroup({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`${className}`}>{children}</div>
}

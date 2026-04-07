import * as React from "react"

interface SidebarContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const { open } = useSidebar()
  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b border-gray-200 px-4 py-4 ${className}`}>{children}</div>
}

export function SidebarContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex-1 overflow-y-auto px-4 py-4 ${className}`}>{children}</div>
}

export function SidebarFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-gray-200 px-4 py-4 ${className}`}>{children}</div>
}

export function SidebarMenu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <ul className={`space-y-2 ${className}`}>{children}</ul>
}

export function SidebarMenuItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <li className={`${className}`}>{children}</li>
}

export function SidebarMenuButton({
  children,
  className = "",
  tooltip = "",
  asChild = false,
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  children: React.ReactNode
  tooltip?: string
  asChild?: boolean
  size?: "default" | "sm" | "lg"
}) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  }

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>
    return React.cloneElement(childElement, {
      className: `w-full text-left font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2 ${sizeClasses[size]} ${className} ${childElement.props?.className || ""}`,
      title: tooltip,
      ...props,
    })
  }

  return (
    <button
      title={tooltip}
      className={`w-full text-left font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarGroupContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

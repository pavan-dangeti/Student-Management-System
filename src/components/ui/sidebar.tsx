import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.ComponentPropsWithoutRef<"div"> {
  collapsed?: boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-200",
        collapsed ? "w-16" : "w-64",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("rounded-md p-2 hover:bg-accent", className)} {...props} />
  ),
)
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 space-y-6 p-4 pt-6", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />,
)
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mt-2", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarGroupLabel = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("px-2 text-xs font-semibold uppercase text-muted-foreground", className)} {...props} />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarMenu = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  ({ className, ...props }, ref) => <nav ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

export type SidebarMenuItemProps = React.ComponentPropsWithoutRef<"div">

export const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export interface SidebarMenuButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string | ((state: unknown) => string) }>
      const existingClassName = child.props.className
      const mergedClassName =
        typeof existingClassName === "function"
          ? (state: unknown) => cn(baseClasses, existingClassName(state))
          : cn(baseClasses, existingClassName)
      return React.cloneElement(child, { className: mergedClassName })
    }
    return (
      <button ref={ref} className={cn(baseClasses, "hover:bg-muted", className)} {...props}>
        {children}
      </button>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export function useSidebar() {
  const [collapsed, setCollapsed] = React.useState(false)
  return { collapsed, setCollapsed }
}

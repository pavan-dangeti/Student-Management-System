import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg"
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  default: "h-10 w-10",
  sm: "h-8 w-8",
  lg: "h-12 w-12",
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)
Avatar.displayName = "Avatar"

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full text-sm font-medium", className)}
      {...props}
    />
  ),
)
AvatarFallback.displayName = "AvatarFallback"

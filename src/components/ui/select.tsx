import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  registerLabel: (value: string, label: React.ReactNode) => void
  selectedLabel?: React.ReactNode
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({})
  const containerRef = React.useRef<HTMLDivElement>(null)

  const registerLabel = React.useCallback((itemValue: string, label: React.ReactNode) => {
    setLabels((prev) => (prev[itemValue] === label ? prev : { ...prev, [itemValue]: label }))
  }, [])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        registerLabel,
        selectedLabel: value ? labels[value] : undefined,
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext()
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectValueProps {
  placeholder?: string
  className?: string
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const { selectedLabel, value } = useSelectContext()
  return (
    <span className={cn("truncate", !value && "text-muted-foreground", className)}>
      {selectedLabel ?? value ?? placeholder}
    </span>
  )
}

export const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelectContext()
    if (!open) {
      return null
    }
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
SelectContent.displayName = "SelectContent"

export interface SelectItemProps extends Omit<React.ComponentPropsWithoutRef<"div">, "value"> {
  value: string
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen, registerLabel } = useSelectContext()
    const isSelected = value === selectedValue

    React.useEffect(() => {
      registerLabel(value, children)
    }, [value, children, registerLabel])

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={() => {
          onValueChange?.(value)
          setOpen(false)
        }}
        className={cn(
          "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
          isSelected && "bg-accent text-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    )
  },
)
SelectItem.displayName = "SelectItem"

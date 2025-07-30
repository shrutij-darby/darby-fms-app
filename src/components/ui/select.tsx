"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react"

import { Input } from "./input"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { showClearButton?: boolean; onClear? : (e: React.MouseEvent) => void }
>(({ className, children, showClearButton, onClear, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <div className="flex items-center gap-1">
      {showClearButton && (
        <div 
          onClick={(e) => {
            console.log('Clear button clicked');
            e.stopPropagation();
            if (onClear) {
              console.log('onClear function exists, calling it');
              onClear(e);
            } else {
              console.log('onClear function is undefined');
            }
          }}
          className="cursor-pointer hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </div>
      )}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </div>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Enhanced Select component with simplified API
export interface SelectDropdownProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  options: { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  allowClear?: boolean
  label?: string
  filter?: boolean
  onFilter?: (searchTerm: string) => Promise<{ value: string; label: string }[]>
  searchPlaceholder?: string
  rules?: { required?: boolean; message?: string }
}

const SelectDropdown = React.forwardRef<HTMLButtonElement, SelectDropdownProps>(
  ({ 
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select an option",
    className,
    triggerClassName,
    disabled = false,
    allowClear = true,
    filter = false,
    label,
    onFilter,
    searchPlaceholder = "Search...",
    rules,
    ...props
  }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string>(
      value !== undefined ? value : defaultValue || ""
    )
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [filteredOptions, setFilteredOptions] = React.useState(options)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    
    // Update internal state when external value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])
    
    // Initialize filtered options with all options
    React.useEffect(() => {
      setFilteredOptions(options)
    }, [options])
    
    const validateValue = React.useCallback((val: string) => {
      if (rules?.required && !val) {
        return rules.message || "This field is required"
      }
      return null
    }, [rules])
    
    const handleValueChange = (newValue: string) => {
      // Validate the new value
      const validationError = validateValue(newValue)
      setError(validationError)
      
      if (value === undefined) {
        setSelectedValue(newValue)
      }
      
      if (onValueChange) {
        onValueChange(newValue)
      }
    }
    
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
    
      if (onValueChange) {
        onValueChange("")
      }
      
      setSelectedValue("")
      
      setOpen(false)
    }
    
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value
      setSearchTerm(term)
      
      if (onFilter) {
        setIsLoading(true)
        try {
          const results = await onFilter(term)
          setFilteredOptions(results)
        } catch (error) {
          console.error('Error filtering options:', error)
          const filtered = options.filter(option => 
            option.label.toLowerCase().includes(term.toLowerCase()))
          setFilteredOptions(filtered)
        } finally {
          setIsLoading(false)
        }
      } else {
        const filtered = options.filter(option => 
          option.label.toLowerCase().includes(term.toLowerCase()))
        setFilteredOptions(filtered)
      }
    }
    
    const selectedOption = options.find(option => option.value === selectedValue)

    // Validate initial value on component mount
    React.useEffect(() => {
      if (rules) {
        const initialError = validateValue(selectedValue)
        setError(initialError)
      }
    }, [rules, selectedValue, validateValue])
    
    return (
      <div className={cn("relative", className)}>
        {label && (
          <div className="mb-2 text-sm font-medium">
            {label}
          </div>
        )}
        
        {/* Error message display */}
        {error && (
          <div className="text-sm text-destructive mb-1">
            {error}
          </div>
        )}
        <Select
          value={selectedValue}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          open={open}
          onOpenChange={setOpen}
          disabled={disabled}
        >
          <div className="relative">
            <div className="relative w-full">
              <SelectTrigger 
                ref={ref} 
                className={cn(triggerClassName, allowClear && selectedValue ? "pr-12" : "pr-8")}
              >
                <SelectValue placeholder={placeholder}>
                  {selectedOption?.label || placeholder}
                </SelectValue>
              </SelectTrigger>
              
              {/* Custom clear button positioned absolutely */}
              {allowClear && selectedValue && (
                <div 
                  className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Custom clear button clicked');
                    handleClear(e);
                  }}
                >
                  <X className="h-3 w-3 text-neutral-500" />
                </div>
              )}
            </div>
          </div>
          
          <SelectContent>
            {filter && (
              <div className="relative px-2 py-2">
                <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="pl-8 h-8 w-full"
                  autoComplete="off"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    )
  }
)

SelectDropdown.displayName = "SelectDropdown"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectDropdown,
}

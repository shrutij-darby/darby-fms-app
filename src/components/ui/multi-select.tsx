"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Search, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

// Define the option type
export interface SelectOption {
  value: string
  label: string
  [key: string]: string // Allow additional properties
}

export interface FilterableMultiSelectProps {
  options: SelectOption[]
  selectedValues?: string[]
  onChange?: (values: string[]) => void
  onSelectionChange?: (selectedOptions: SelectOption[]) => void
  placeholder?: string
  filter?: boolean
  onAFetch?: (searchTerm: string) => Promise<SelectOption[]>
  disabled?: boolean
  className?: string
  maxDisplayTags?: number
  noOptionsMessage?: string
  searchPlaceholder?: string
}

/**
 * FilterableMultiSelect - A unified select dropdown component with search and multi-select capabilities
 * 
 * Features:
 * - Search functionality (enabled by filter prop)
 * - Local filtering (default) or API-based filtering (via onAFetch prop)
 * - Multi-select support with selected items displayed as tags/chips
 * - Deselect functionality with cross (X) icon for each selected item
 */
export function FilterableMultiSelect({
  options: initialOptions,
  selectedValues = [],
  onChange,
  onSelectionChange,
  placeholder = "Select options...",
  filter = false,
  onAFetch,
  disabled = false,
  className,
  maxDisplayTags = 5,
  noOptionsMessage = "No options available",
  searchPlaceholder = "Search...",
}: FilterableMultiSelectProps) {
  // State for options, selected values, search term, and dropdown open state
  const [options, setOptions] = useState<SelectOption[]>(initialOptions)
  const [selected, setSelected] = useState<string[]>(selectedValues)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Refs for click outside detection
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Effect to handle initial selected values
  useEffect(() => {
    setSelected(selectedValues)
  }, [selectedValues])
  
  // Effect to handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  // Function to handle search input changes
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (onAFetch) {
      // API-based filtering
      setIsLoading(true)
      try {
        const fetchedOptions = await onAFetch(value)
        setOptions(fetchedOptions)
      } catch (error) {
        console.error("Error fetching options:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Local filtering
      const filtered = value
        ? initialOptions.filter(option => 
            option.label.toLowerCase().includes(value.toLowerCase()))
        : initialOptions
      setOptions(filtered)
    }
  }
  
  // Function to toggle selection of an option
  const toggleOption = (value: string) => {
    setSelected(prev => {
      const isSelected = prev.includes(value)
      const newSelected = isSelected
        ? prev.filter(v => v !== value)
        : [...prev, value]
      
      // Call onChange callback if provided
      if (onChange) {
        onChange(newSelected)
      }
      
      // Call onSelectionChange callback if provided
      if (onSelectionChange) {
        const selectedOptions = initialOptions.filter(option => 
          newSelected.includes(option.value)
        )
        onSelectionChange(selectedOptions)
      }
      
      return newSelected
    })
  }
  
  // Function to remove a selected option
  const removeOption = (e: React.MouseEvent, value: string) => {
    e.stopPropagation() // Prevent dropdown from toggling
    toggleOption(value)
  }
  
  // Function to clear search input and focus it
  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }
  
  // Get selected options data
  const selectedOptions = initialOptions.filter(option => 
    selected.includes(option.value)
  )
  
  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        // Reset search when opening
        setSearchTerm("")
        setOptions(initialOptions)
        // Focus search input when dropdown opens
        setTimeout(focusSearchInput, 0)
      }
    }
  }
  
  // Determine if we should show "more" indicator for selected tags
  const showMoreCount = selectedOptions.length > maxDisplayTags
    ? selectedOptions.length - maxDisplayTags
    : 0
  
  // Displayed selected tags (limited by maxDisplayTags)
  const displayedTags = selectedOptions.slice(0, maxDisplayTags)
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full",
        className
      )}
    >
      {/* Main trigger/display area */}
      <div
        onClick={toggleDropdown}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          isFocused && "ring-2 ring-ring ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
      >
        {/* Selected tags display */}
        <div className="flex flex-wrap gap-1 mr-2">
          {displayedTags.map(option => (
            <div 
              key={option.value}
              className="bg-muted text-muted-foreground flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
            >
              {option.label}
              <X 
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={(e) => removeOption(e, option.value)}
              />
            </div>
          ))}
          
          {/* Show "more" indicator if needed */}
          {showMoreCount > 0 && (
            <div className="border text-muted-foreground px-2 py-0.5 text-xs rounded-full">
              +{showMoreCount} more
            </div>
          )}
        </div>
        
        {/* Placeholder when nothing selected */}
        {selectedOptions.length === 0 && (
          <span className="text-muted-foreground flex-grow text-left">
            {placeholder}
          </span>
        )}
        
        {/* Dropdown indicator */}
        <div className="ml-auto flex shrink-0 opacity-50">
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {/* Search input */}
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
          
          {/* Options list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
               <Loader2 className="animate-spin" />
              </div>
            ) : options.length > 0 ? (
              options.map(option => {
                const isOptionSelected = selected.includes(option.value)
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      isOptionSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {isOptionSelected && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

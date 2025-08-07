"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface CustomDialogProps {
  /**
   * Controls dialog visibility
   */
  visible: boolean
  
  /**
   * Callback when dialog is closed
   */
  onHide: () => void
  
  /**
   * Dialog title (string or JSX)
   */
  title?: React.ReactNode
  
  /**
   * Dialog content
   */
  children: React.ReactNode
  
  /**
   * Optional footer with action buttons
   */
  footer?: React.ReactNode
  
  /**
   * Show/hide close icon (default: true)
   */
  closable?: boolean
  
  /**
   * Dialog size: "sm" | "md" | "lg" | "xl"
   */
  size?: "sm" | "md" | "lg" | "xl"
  
  /**
   * Additional CSS class names
   */
  className?: string

  /**
   * Display as a slide-over panel instead of a centered dialog
   */
  slideOver?: boolean

  /**
   * Position of the slide-over panel ("left" or "right")
   */
  position?: "left" | "right"
  
  /**
   * Enable or disable animations (default: true)
   */
  animated?: boolean
}

/**
 * A reusable dialog component with customizable size, header, and footer
 */
export function CustomDialog({
  visible,
  onHide,
  title,
  children,
  footer,
  closable = true,
  size = "md",
  className,
  slideOver = false,
  position = "right",
  animated = true,
}: CustomDialogProps) {
  // Size mapping for max-width classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }
  
  // Classes for slide-over mode
  const slideOverClasses = {
    left: cn(
      "fixed inset-y-0 left-0 h-full w-full sm:w-[350px] md:w-[450px] border-r rounded-none p-6 translate-x-0 translate-y-0 !top-0 !bottom-0",
      animated ? "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left" : ""
    ),
    right: cn(
      "fixed inset-y-0 right-0 h-full w-full sm:w-[350px] md:w-[450px] border-l rounded-none p-6 translate-x-0 translate-y-0 !top-0 !bottom-0",
      animated ? "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right" : ""
    ),
  }

  return (
    <Dialog open={visible}  onOpenChange={(open) => !open && onHide()}>
      <DialogContent 
        className={cn(
          slideOver ? slideOverClasses[position] : sizeClasses[size],
          "overflow-hidden",
        
          className
        )}
        onEscapeKeyDown={closable ? onHide : undefined}
        onPointerDownOutside={closable ? onHide : undefined}
      >
        {/* Dialog header with title and close button */}
        {(title || closable) && (
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {title && (
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            )}
            {closable && (
              <DialogClose 
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={onHide}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </DialogHeader>
        )}

        {/* Dialog content */}
        <div className="py-2">
          {children}
        </div>

        {/* Dialog footer */}
        {footer && (
          <DialogFooter className="pt-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

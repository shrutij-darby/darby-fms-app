"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CustomDialog } from "@/components/ui/custom-dialog"

export function DialogExample() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [dialogSize, setDialogSize] = React.useState<"sm" | "md" | "lg" | "xl">("md")
  const [isClosable, setIsClosable] = React.useState(true)
  
  const openDialog = (size: "sm" | "md" | "lg" | "xl") => {
    setDialogSize(size)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => openDialog("sm")}>Open Small Dialog</Button>
        <Button onClick={() => openDialog("md")}>Open Medium Dialog</Button>
        <Button onClick={() => openDialog("lg")}>Open Large Dialog</Button>
        <Button onClick={() => openDialog("xl")}>Open Extra Large Dialog</Button>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <input 
          type="checkbox" 
          id="closable" 
          checked={isClosable}
          onChange={(e) => setIsClosable(e.target.checked)} 
        />
        <label htmlFor="closable">Show close button & allow outside click close</label>
      </div>

      <CustomDialog
        visible={isDialogOpen}
        onHide={() => setIsDialogOpen(false)}
        title={`${dialogSize.toUpperCase()} Dialog Example`}
        size={dialogSize}
        closable={isClosable}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p>This is a {dialogSize} sized dialog with the following features:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Controlled visibility (managed by parent component)</li>
            <li>Custom title and footer</li>
            <li>Configurable size ({dialogSize})</li>
            <li>Close button {isClosable ? 'enabled' : 'disabled'}</li>
            <li>Outside click to close {isClosable ? 'enabled' : 'disabled'}</li>
          </ul>
        </div>
      </CustomDialog>
    </div>
  )
}

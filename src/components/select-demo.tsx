"use client"

import { useState } from "react"
import { FilterableMultiSelect, SelectOption } from "./ui/multi-select"

// Sample data for the demo
const sampleOptions: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
  { value: "mango", label: "Mango" },
  { value: "nectarine", label: "Nectarine" },
  { value: "orange", label: "Orange" },
  { value: "papaya", label: "Papaya" },
]

export function SelectDemo() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])
  
  // Simulate API fetch for the API filtering demo
  const handleAPIFetch = async (searchTerm: string): Promise<SelectOption[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter options based on search term
    return sampleOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }
  
  return (
    <div className="space-x-8 p-6 flex">
      <div>
        <h2 className="text-lg font-medium mb-2">Basic Multi-Select with Local Filtering</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This example uses local filtering with the filter prop enabled.
        </p>
        <FilterableMultiSelect
          options={sampleOptions}
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          onSelectionChange={setSelectedOptions}
          placeholder="Select fruits..."
          filter={true}
          className="w-full max-w-md"
        />
        
     
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">API-based Filtering Example</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This example simulates API-based filtering using the onAFetch prop.
        </p>
        <FilterableMultiSelect
          options={sampleOptions}
          placeholder="Search fruits via API..."
          filter={true}
          onAFetch={handleAPIFetch}
          className="w-full max-w-md"
          searchPlaceholder="Type to search via API..."
        />
      </div>
    </div>
  )
}

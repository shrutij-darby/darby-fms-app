import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"

export interface VerticalListItem {
  title: string
  value: string
  change?: {
    value: string
    type: 'increase' | 'decrease'
  }
}

interface VerticalListProps {
  title: string
  description?: string
  items: VerticalListItem[]
  className?: string
}

export function VerticalList({ title, description, items, className }: VerticalListProps) {
  return (
    <div className={cn('w-full rounded-lg bg-card shadow-sm overflow-hidden', className)}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{item.value}</p>
                {item.change && (
                  <div className={cn(
                    "flex items-center text-sm",
                    item.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}>
                    <ArrowUp className={cn(
                      "h-4 w-4 mr-1",
                      item.change.type === 'decrease' && 'rotate-180'
                    )} />
                    {item.change.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

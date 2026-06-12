import { cn } from "@/lib/utils"
import { Video as LucideIcon } from "lucide-react"

interface PageHeaderProps {
  icon?: LucideIcon
  title: string
  description: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ icon: Icon, title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex justify-between items-end", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 sm:text-3xl">
          {Icon && <Icon className="h-7 w-7 text-primary" />}
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}

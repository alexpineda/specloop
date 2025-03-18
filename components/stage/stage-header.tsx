/*
<ai_context>
A component for displaying a header with title, description, and optional toolbar in a stage layout.
</ai_context>
<recent_changes>
Added icon prop to display an icon next to the title, similar to session-progress-sidebar.tsx.
</recent_changes>
*/

import { LucideIcon } from "lucide-react"

export const StageHeader = ({
  title,
  description,
  children,
  nextButton,
  icon: Icon
}: {
  title: string
  description: string
  children?: React.ReactNode
  nextButton?: React.ReactNode
  icon?: LucideIcon
}) => {
  return (
    <div className="mb-8">
      <span className="items-top mb-4 flex justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            {Icon && <Icon className="text-primary size-5" />}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground max-w-prose text-sm">
            {description}
          </p>
        </div>
        {nextButton}
      </span>
      <>{children}</>
    </div>
  )
}

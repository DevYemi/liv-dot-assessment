import { Settings2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/views/globalComponents/shadcn-ui/switch'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/views/globalComponents/shadcn-ui/collapsible'
import type {
  TRequirementSchema,
  TRequirementKeySchema,
} from '@/data/schemas/event'

interface RequirementToggleProps {
  requirements: TRequirementSchema[]
  isPending: boolean
  onToggle: (key: TRequirementKeySchema) => void
}

export function RequirementToggle({
  requirements,
  isPending,
  onToggle,
}: RequirementToggleProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-left text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-400">
        <Settings2 className="h-3.5 w-3.5" />
        <span>Dev Controls — Simulate Requirements</span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
          {requirements.map((req) => (
            <div
              key={req.key}
              className="flex items-center justify-between rounded px-2 py-1.5"
            >
              <span className="text-xs text-zinc-400">{req.label}</span>
              <Switch
                checked={req.satisfied}
                disabled={isPending}
                onCheckedChange={() => onToggle(req.key)}
                className="scale-75 data-checked:bg-violet-600"
              />
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

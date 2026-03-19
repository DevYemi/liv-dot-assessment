import { CheckCircle2, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/views/globalComponents/shadcn-ui/card'
import { Progress } from '@/views/globalComponents/shadcn-ui/progress'
import type { TRequirementSchema } from '@/data/schemas/event'

interface OperationalReadinessPanelProps {
  requirements: TRequirementSchema[]
}

export function OperationalReadinessPanel({
  requirements,
}: OperationalReadinessPanelProps) {
  const satisfied = requirements.filter((r) => r.satisfied).length
  const total = requirements.length
  const percent = Math.round((satisfied / total) * 100)

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
            Operational Readiness
          </CardTitle>
          <span className="text-sm font-medium text-zinc-300">
            {satisfied}/{total}
          </span>
        </div>
        <Progress
          value={percent}
          className="mt-2 h-1.5 bg-zinc-800 [&>div]:bg-violet-500"
        />
      </CardHeader>
      <CardContent className="space-y-3">
        {requirements.map((req) => (
          <div
            key={req.key}
            className="flex items-start gap-3 rounded-lg p-2 transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {req.satisfied ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${req.satisfied ? 'text-zinc-200' : 'text-zinc-400'}`}
              >
                {req.label}
              </p>
              <p className="mt-0.5 text-xs text-zinc-600">{req.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

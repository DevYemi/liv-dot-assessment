import { cn } from '@/utils/shadcn'
import type { TEventStateSchema } from '@/data/schemas/event'

const STATES: { key: TEventStateSchema; label: string; short: string }[] = [
  { key: 'draft', label: 'Draft', short: 'Draft' },
  { key: 'scheduled', label: 'Scheduled', short: 'Scheduled' },
  { key: 'readyForStreaming', label: 'Ready for Streaming', short: 'Ready' },
  { key: 'live', label: 'Live', short: 'Live' },
  { key: 'completed', label: 'Completed', short: 'Done' },
  { key: 'replayAvailable', label: 'Replay Available', short: 'Replay' },
]

const STATE_ORDER: TEventStateSchema[] = STATES.map((s) => s.key)

function getStepStatus(
  stepKey: TEventStateSchema,
  currentState: TEventStateSchema,
): 'past' | 'current' | 'future' {
  const stepIdx = STATE_ORDER.indexOf(stepKey)
  const currentIdx = STATE_ORDER.indexOf(currentState)
  if (stepIdx < currentIdx) return 'past'
  if (stepIdx === currentIdx) return 'current'
  return 'future'
}

interface LifecycleTimelineProps {
  currentState: TEventStateSchema
}

export function LifecycleTimeline({ currentState }: LifecycleTimelineProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {STATES.map((step, i) => {
          const status = getStepStatus(step.key, currentState)
          const isLast = i === STATES.length - 1

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                    status === 'past' &&
                      'border-violet-500 bg-violet-500 text-white',
                    status === 'current' &&
                      'border-violet-400 bg-violet-950 text-violet-300 ring-2 ring-violet-500/30 ring-offset-2 ring-offset-zinc-950',
                    status === 'future' &&
                      'border-zinc-700 bg-zinc-900 text-zinc-600',
                  )}
                >
                  {status === 'past' ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'hidden text-center text-xs font-medium sm:block',
                    status === 'past' && 'text-violet-400',
                    status === 'current' && 'text-violet-300',
                    status === 'future' && 'text-zinc-600',
                  )}
                >
                  {step.short}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 transition-all duration-500',
                    status === 'past' ? 'bg-violet-500' : 'bg-zinc-800',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

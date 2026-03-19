import { Calendar, DollarSign, ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/views/globalComponents/shadcn-ui/card'
import type { TEventSchema, TEventStateSchema } from '@/data/schemas/event'
import { cn } from '#/utils/shadcn'
import { formatDate } from '#/utils/eventChunks'

const STATE_CONFIG: Record<
  TEventStateSchema,
  { label: string; className: string; dot?: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    dot: 'bg-zinc-500',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-950 text-blue-300 border-blue-800',
    dot: 'bg-blue-400',
  },
  readyForStreaming: {
    label: 'Ready for Streaming',
    className: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    dot: 'bg-emerald-400',
  },
  live: {
    label: 'Live',
    className: 'bg-red-950 text-red-300 border-red-800',
    dot: 'bg-red-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-purple-950 text-purple-300 border-purple-800',
    dot: 'bg-purple-400',
  },
  replayAvailable: {
    label: 'Replay Available',
    className: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    dot: 'bg-indigo-400',
  },
}

interface EventHeroProps {
  event: TEventSchema
}

export function EventHero({ event }: EventHeroProps) {
  const config = STATE_CONFIG[event.state]
  const isLive = event.state === 'live'
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur">
      <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-violet-950/60 via-zinc-900 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15),transparent_60%)]" />
        {event.thumbnailUrl ? (
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-700">
            <ImageIcon className="h-10 w-10" />
            <span className="text-xs">No thumbnail uploaded</span>
          </div>
        )}
      </div>

      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">
              {event.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {event.description}
            </p>
          </div>
          <span
            className={cn(
              'inline-flex items-center px-3 py-1 text-sm gap-1.5 rounded-full border font-medium',
              config.className,
            )}
          >
            <span
              className={cn(
                'rounded-full h-2 w-2',
                config.dot,
                isLive && 'animate-pulse',
              )}
            />
            {config.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-800 pt-4">
          {event.scheduledAt && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="h-4 w-4 text-zinc-600" />
              <span>{formatDate(event.scheduledAt)}</span>
            </div>
          )}
          {event.ticketPrice !== null && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <DollarSign className="h-4 w-4 text-zinc-600" />
              <span>${event.ticketPrice.toFixed(2)} per ticket</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

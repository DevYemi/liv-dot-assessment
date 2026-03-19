import { Loader2, AlertCircle, Users } from 'lucide-react'
import { Separator } from '@/views/globalComponents/shadcn-ui/separator'
import { TooltipProvider } from '@/views/globalComponents/shadcn-ui/tooltip'
import { useEventDashboard } from './useEventDashboard'
import { EventHero } from './local-components/EventHero'
import { LifecycleTimeline } from './local-components/LifecycleTimeline'
import { OperationalReadinessPanel } from './local-components/OperationalReadinessPanel'
import { ActionBar } from './local-components/ActionBar'
import { RequirementToggle } from './local-components/RequirementToggle'
import { StreamPreviewPlayer } from './local-components/StreamPreviewPlayer'

export default function EventDashboard() {
  const { eventData, eventIsLoading, eventIsError } = useEventDashboard()

  if (eventIsLoading) {
    return (
      <div className="flex min-h-[90vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <span className="text-sm">Loading event…</span>
        </div>
      </div>
    )
  }

  if (eventIsError || !eventData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="text-sm">Failed to load event. Please refresh.</span>
        </div>
      </div>
    )
  }

  const isLive = eventData.state === 'live'
  const isReplayAvailable = eventData.state === 'replayAvailable'
  const showPlayer = isLive || isReplayAvailable
  const showReadiness =
    eventData.state === 'scheduled' || eventData.state === 'readyForStreaming'

  return (
    <TooltipProvider>
      <div>
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-600">
                {eventData.id}
              </span>
            </div>
            <h2 className="mb-6 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              Event Status
            </h2>
            <LifecycleTimeline currentState={eventData.state} />
          </div>

          <Separator className="mb-8 bg-zinc-800" />

          {showPlayer && (
            <div className="mb-6">
              <StreamPreviewPlayer isLive={isLive} />
            </div>
          )}

          {isLive && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-6 py-3">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" />
                <span className="text-sm font-semibold text-red-400">
                  LIVE NOW
                </span>
                <span className="h-4 w-px bg-red-900" />
                <Users className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-300">
                  {eventData.viewerCount.toLocaleString()} watching
                </span>
              </div>
            </div>
          )}

          <div
            className={`grid gap-6 ${showReadiness ? 'lg:grid-cols-5' : 'lg:grid-cols-1'}`}
          >
            <div className={showReadiness ? 'lg:col-span-3' : ''}>
              <EventHero event={eventData} />
            </div>

            {showReadiness && (
              <div className="lg:col-span-2">
                <OperationalReadinessPanel
                  requirements={eventData.requirements}
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <ActionBar />
          </div>

          <div className="mt-12">
            <RequirementToggle />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

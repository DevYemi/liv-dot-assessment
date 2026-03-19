import { Loader2, AlertCircle } from 'lucide-react'
import { Separator } from '@/views/globalComponents/shadcn-ui/separator'
import { TooltipProvider } from '@/views/globalComponents/shadcn-ui/tooltip'
import { useEventDashboard } from './useEventDashboard'
import { ActionBar } from './local-components/ActionBar'
import { EventHero } from './local-components/EventHero'
import { LifecycleTimeline } from './local-components/LifecycleTimeline'
import { LiveViewerBanner } from './local-components/LiveViewerBanner'
import { ReadinessPanel } from './local-components/ReadinessPanel'
import { RequirementToggle } from './local-components/RequirementToggle'

export default function EventDashboard() {
  const {
    eventData,
    eventIsLoading,
    eventIsError,
    canAdvance,
    transitionReason,
    isTransitioning,
    isTogglingRequirement,
    updateEventStateHandler,
    updateRequirementHandler,
  } = useEventDashboard()

  if (eventIsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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
              Event Lifecycle
            </h2>
            <LifecycleTimeline currentState={eventData.state} />
          </div>

          <Separator className="mb-8 bg-zinc-800" />

          {isLive && (
            <div className="mb-6">
              <LiveViewerBanner viewerCount={eventData.viewerCount} />
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
                <ReadinessPanel requirements={eventData.requirements} />
              </div>
            )}
          </div>

          <div className="mt-6">
            <ActionBar
              state={eventData.state}
              canTransition={canAdvance}
              transitionReason={transitionReason}
              isPending={isTransitioning}
              onTransition={updateEventStateHandler}
            />
          </div>

          <div className="mt-12">
            <RequirementToggle
              requirements={eventData.requirements}
              isPending={isTogglingRequirement}
              onToggle={updateRequirementHandler}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

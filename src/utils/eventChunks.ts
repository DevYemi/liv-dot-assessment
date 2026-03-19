import type { TEventSchema, TEventStateSchema } from '@/data/schemas/event'

const STATE_ORDER: TEventStateSchema[] = [
  'draft',
  'scheduled',
  'readyForStreaming',
  'live',
  'completed',
  'replayAvailable',
]

export function getNextState(
  state: TEventStateSchema,
): TEventStateSchema | null {
  const idx = STATE_ORDER.indexOf(state)
  if (idx === -1 || idx === STATE_ORDER.length - 1) return null
  return STATE_ORDER[idx + 1]
}

export function canTransition(event: TEventSchema): {
  allowed: boolean
  reason?: string
} {
  if (event.state === 'scheduled') {
    const unmet = event.requirements.filter((r) => !r.satisfied)
    if (unmet.length > 0) {
      const labels = unmet.map((r) => r.label).join(', ')
      return { allowed: false, reason: `Missing requirements: ${labels}` }
    }
  }

  if (event.state === 'replayAvailable') {
    return { allowed: false, reason: 'Event is fully complete.' }
  }

  return { allowed: true }
}

export function allRequirementsSatisfied(event: TEventSchema): boolean {
  return event.requirements.every((r) => r.satisfied)
}

// ---------------------------------------------------------------------------
// Async service functions — simulate network I/O with artificial latency
// ---------------------------------------------------------------------------
export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso))
}

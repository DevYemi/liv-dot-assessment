import type {
  TEventSchema,
  TEventStateSchema,
  TRequirementKeySchema,
} from '@/data/schemas/event'
import { canTransition, delay } from '@/utils/eventChunks'
import { EVENT_STORE } from '@/constants/dummyData'

/** GET /events/:id */
export async function getEventById(id: string): Promise<TEventSchema> {
  await delay(600)
  const event = EVENT_STORE[id]
  if (!event) throw new Error(`Event "${id}" not found`)
  return { ...event }
}

/** PATCH /events/:id/state — advances to the given lifecycle state */
export async function updateEventState(
  id: string,
  state: TEventStateSchema,
): Promise<TEventSchema> {
  await delay(500)
  const event = EVENT_STORE[id]
  if (!event) throw new Error(`Event "${id}" not found`)

  const check = canTransition(event)
  if (!check.allowed) throw new Error(check.reason)

  const updated: TEventSchema = {
    ...event,
    state,
    viewerCount: state === 'live' ? 1284 : event.viewerCount,
  }

  EVENT_STORE[id] = updated
  return { ...updated }
}

/** PATCH /events/:id/requirements/:key — sets a requirement's satisfied state */
export async function updateRequirement(
  id: string,
  key: TRequirementKeySchema,
  satisfied: boolean,
): Promise<TEventSchema> {
  await delay(300)
  const event = EVENT_STORE[id]
  if (!event) throw new Error(`Event "${id}" not found`)

  const updatedRequirements = event.requirements.map((r) =>
    r.key === key ? { ...r, satisfied } : r,
  )

  let nextState = event.state

  // Auto-advance: scheduled → readyForStreaming when all requirements are met
  if (
    event.state === 'scheduled' &&
    updatedRequirements.every((r) => r.satisfied)
  ) {
    nextState = 'readyForStreaming'
  }

  // Auto-regress: readyForStreaming → scheduled when a requirement breaks
  if (
    event.state === 'readyForStreaming' &&
    !updatedRequirements.every((r) => r.satisfied)
  ) {
    nextState = 'scheduled'
  }

  const updated: TEventSchema = {
    ...event,
    state: nextState,
    requirements: updatedRequirements,
  }

  EVENT_STORE[id] = updated
  return { ...updated }
}

/** PATCH /events/:id/thumbnail */
export async function updateEventThumbnail(
  id: string,
  thumbnailUrl: string | null,
): Promise<TEventSchema> {
  await delay(300)
  const event = EVENT_STORE[id]
  if (!event) throw new Error(`Event "${id}" not found`)

  const updatedRequirements = event.requirements.map((r) =>
    r.key === 'thumbnailUploaded' ? { ...r, satisfied: thumbnailUrl !== null } : r,
  )

  const updated: TEventSchema = { ...event, thumbnailUrl, requirements: updatedRequirements }
  EVENT_STORE[id] = updated
  return { ...updated }
}

/** PATCH /events/:id/ticket-price */
export async function updateEventTicketPrice(
  id: string,
  ticketPrice: number | null,
): Promise<TEventSchema> {
  await delay(300)
  const event = EVENT_STORE[id]
  if (!event) throw new Error(`Event "${id}" not found`)

  const updatedRequirements = event.requirements.map((r) =>
    r.key === 'pricingConfigured' ? { ...r, satisfied: ticketPrice !== null } : r,
  )

  const updated: TEventSchema = { ...event, ticketPrice, requirements: updatedRequirements }
  EVENT_STORE[id] = updated
  return { ...updated }
}

export const eventService = {
  getEventById,
  updateEventState,
  updateRequirement,
  updateEventThumbnail,
  updateEventTicketPrice,
}

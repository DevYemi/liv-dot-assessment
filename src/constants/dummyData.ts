import type { TEventSchema } from '@/data/schemas/event'

// ---------------------------------------------------------------------------
//  store (simulates a backend database)
// ---------------------------------------------------------------------------
const SEED_EVENT: TEventSchema = {
  id: 'evt-001',
  title: 'The Future of Independent Music — Live Summit',
  description:
    'A live panel and performance event featuring independent artists, producers, and industry voices exploring what the next decade holds for music creation, distribution, and fan connection.',
  scheduledAt: null,
  state: 'draft',
  thumbnailUrl: null,
  viewerCount: 0,
  ticketPrice: null,
  requirements: [
    {
      key: 'crewAssigned',
      label: 'Production Crew',
      description:
        'A production crew must be assigned to handle the broadcast.',
      satisfied: false,
    },
    {
      key: 'ingestConfigured',
      label: 'Stream Ingest',
      description: 'Streaming ingest endpoint must be configured and tested.',
      satisfied: false,
    },
    {
      key: 'pricingConfigured',
      label: 'Ticket Pricing',
      description: 'Ticket price must be set before the event can go live.',
      satisfied: false,
    },
    {
      key: 'thumbnailUploaded',
      label: 'Event Thumbnail',
      description: 'A thumbnail image must be uploaded for the event listing.',
      satisfied: false,
    },
  ],
}

/** Mutable in-memory store — keyed by event id */
const EVENT_STORE: Record<string, TEventSchema | undefined> = {
  [SEED_EVENT.id]: { ...SEED_EVENT },
}
const EVENT_ID = 'evt-001'
export { EVENT_STORE, EVENT_ID }

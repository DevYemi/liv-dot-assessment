import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventDashboard from '@/views/pages/EventDashboard'
import { EVENT_STORE, EVENT_ID, SEED_EVENT } from '@/constants/dummyData'
import type { TEventSchema } from '@/data/schemas/event'
import { renderWithProviders } from '@/test/utils'

vi.mock('@/utils/eventChunks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/eventChunks')>()
  return { ...actual, delay: () => Promise.resolve() }
})

vi.mock(
  '@/views/pages/EventDashboard/local-components/StreamPreviewPlayer',
  () => ({
    StreamPreviewPlayer: ({ isLive }: { isLive: boolean }) => (
      <div data-testid="stream-preview-player">
        {isLive ? 'Live Stream' : 'Replay Stream'}
      </div>
    ),
  }),
)

const resetStore = (overrides: Partial<TEventSchema> = {}) => {
  EVENT_STORE[EVENT_ID] = {
    ...SEED_EVENT,
    ...overrides,
    requirements: (overrides.requirements ?? SEED_EVENT.requirements).map(
      (r) => ({ ...r }),
    ),
  }
}

const ALL_REQUIREMENTS_MET = SEED_EVENT.requirements.map((r) => ({
  ...r,
  satisfied: true,
}))

beforeEach(() => {
  resetStore()
})

describe('Event Dashboard', () => {
  describe('Loading and error states', () => {
    it('shows a loading spinner while the event is being fetched', () => {
      renderWithProviders(<EventDashboard />)
      expect(screen.getByText('Loading event…')).toBeInTheDocument()
    })

    it('shows an error message when the event cannot be found', async () => {
      delete EVENT_STORE['evt-001']
      renderWithProviders(<EventDashboard />)
      await screen.findByText('Failed to load event. Please refresh.')
    })
  })

  describe('Draft state', () => {
    it('shows "Draft" as the active step in the lifecycle timeline', async () => {
      renderWithProviders(<EventDashboard />)

      const draftLabels = await screen.findAllByText('Draft')
      expect(draftLabels.length).toBeGreaterThan(0)
    })

    it('does not show the Operational Readiness panel in draft state', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByText('The Future of Independent Music — Live Summit')
      expect(
        screen.queryByText('Operational Readiness'),
      ).not.toBeInTheDocument()
    })

    it('shows the "Draft" badge on the event card', async () => {
      renderWithProviders(<EventDashboard />)

      const draftBadges = await screen.findAllByText('Draft')
      expect(draftBadges.length).toBeGreaterThan(0)
    })
  })

  describe('Scheduling the event', () => {
    it('opens a date-picker popover when "Schedule Event" is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /schedule event/i })
      await user.click(screen.getByRole('button', { name: /schedule event/i }))
      await screen.findByRole('button', { name: /confirm schedule/i })
    })

    it('transitions to "Scheduled" state after confirming a date', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /schedule event/i })
      await user.click(screen.getByRole('button', { name: /schedule event/i }))
      await screen.findByRole('button', { name: /confirm schedule/i })

      const allButtons = screen.getAllByRole('button')
      const futureDayBtn = allButtons.find(
        (btn) =>
          /^\d{1,2}$/.test(btn.textContent.trim() || '') &&
          !btn.hasAttribute('disabled'),
      )!
      await user.click(futureDayBtn)
      await user.click(
        screen.getByRole('button', { name: /confirm schedule/i }),
      )

      await screen.findByRole('button', { name: /mark as ready/i })
    })
  })

  describe('Scheduled state (requirements unmet)', () => {
    beforeEach(() => {
      resetStore({
        state: 'scheduled',
        scheduledAt: '2026-04-15T18:00:00.000Z',
      })
    })

    it('shows "Mark as Ready" button disabled while requirements are unmet', async () => {
      renderWithProviders(<EventDashboard />)
      const btn = await screen.findByRole('button', { name: /mark as ready/i })
      expect(btn).toBeDisabled()
    })

    it('shows a warning listing the missing requirements', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByText(/missing requirements/i)
    })

    it('shows the Operational Readiness panel', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByText('Operational Readiness')
    })

    it('shows the scheduled date in the event card', async () => {
      renderWithProviders(<EventDashboard />)

      await screen.findByText(/April/i)
    })
  })

  describe('Requirement management', () => {
    beforeEach(() => {
      resetStore({
        state: 'scheduled',
        scheduledAt: '2026-04-15T18:00:00.000Z',
      })
    })

    it('toggling Production Crew switch marks it as satisfied', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)

      await screen.findAllByText('Production Crew')

      const [crewSwitch] = screen.getAllByRole('switch')
      expect(crewSwitch).toHaveAttribute('aria-checked', 'false')

      await user.click(crewSwitch)

      await waitFor(() => {
        expect(crewSwitch).toHaveAttribute('aria-checked', 'true')
      })
    })

    it('toggling Stream Ingest switch marks it as satisfied', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findAllByText('Stream Ingest')

      const switches = screen.getAllByRole('switch')
      const ingestSwitch = switches[1]
      await user.click(ingestSwitch)

      await waitFor(() => {
        expect(ingestSwitch).toHaveAttribute('aria-checked', 'true')
      })
    })

    it('toggling a satisfied requirement back to unsatisfied works', async () => {
      resetStore({
        state: 'scheduled',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: SEED_EVENT.requirements.map((r) =>
          r.key === 'crewAssigned' ? { ...r, satisfied: true } : { ...r },
        ),
      })
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findAllByText('Production Crew')

      const [crewSwitch] = screen.getAllByRole('switch')
      expect(crewSwitch).toHaveAttribute('aria-checked', 'true')

      await user.click(crewSwitch)

      await waitFor(() => {
        expect(crewSwitch).toHaveAttribute('aria-checked', 'false')
      })
    })

    it('setting a ticket price satisfies the pricing requirement', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findAllByText('Ticket Pricing')

      const priceInput = screen.getByPlaceholderText('0.00')
      await user.clear(priceInput)
      await user.type(priceInput, '25.00')
      await user.click(screen.getByRole('button', { name: /^set$/i }))

      await screen.findByText('$25.00 per ticket')
    })

    it('auto-advances to readyForStreaming when the last requirement is met', async () => {
      resetStore({
        state: 'scheduled',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        ticketPrice: 20,
        thumbnailUrl: 'data:image/png;base64,abc',
        requirements: SEED_EVENT.requirements.map((r) => ({
          ...r,
          satisfied: r.key !== 'crewAssigned',
        })),
      })

      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByText('3/4')

      const [crewSwitch] = screen.getAllByRole('switch')
      await user.click(crewSwitch)

      await screen.findByRole('button', { name: /go live/i })
    })

    it('auto-regresses from readyForStreaming back to scheduled when a requirement is unmet', async () => {
      resetStore({
        state: 'readyForStreaming',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })

      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /go live/i })

      const switches = screen.getAllByRole('switch')
      await user.click(switches[1])

      await screen.findByRole('button', { name: /mark as ready/i })
    })
  })

  describe('Ready for Streaming state', () => {
    beforeEach(() => {
      resetStore({
        state: 'readyForStreaming',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('shows the "Go Live" button enabled', async () => {
      renderWithProviders(<EventDashboard />)
      const btn = await screen.findByRole('button', { name: /go live/i })
      expect(btn).not.toBeDisabled()
    })

    it('does not show the missing-requirements warning alert', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /go live/i })
      expect(
        screen.queryByText(/missing requirements/i),
      ).not.toBeInTheDocument()
    })

    it('shows readiness progress as 4/4', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByText('4/4')
    })
  })

  describe('Going live', () => {
    beforeEach(() => {
      resetStore({
        state: 'readyForStreaming',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('transitions to live state when "Go Live" is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /go live/i })
      await user.click(screen.getByRole('button', { name: /go live/i }))

      await screen.findByRole('button', { name: /end stream/i })
    })

    it('shows the LIVE NOW banner after going live', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /go live/i })
      await user.click(screen.getByRole('button', { name: /go live/i }))

      await screen.findByText('LIVE NOW')
    })

    it('shows the stream preview player after going live', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /go live/i })
      await user.click(screen.getByRole('button', { name: /go live/i }))

      await screen.findByTestId('stream-preview-player')
    })
  })

  describe('Live state', () => {
    beforeEach(() => {
      resetStore({
        state: 'live',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        viewerCount: 1284,
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('shows the "End Stream" button', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /end stream/i })
    })

    it('locks the requirement switches when the event is live', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /end stream/i })

      const switches = screen.getAllByRole('switch')
      switches.forEach((sw) => {
        expect(sw).toHaveAttribute('data-disabled')
      })
    })
  })

  describe('Ending the stream', () => {
    beforeEach(() => {
      resetStore({
        state: 'live',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        viewerCount: 1284,
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('transitions to completed state when "End Stream" is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /end stream/i })
      await user.click(screen.getByRole('button', { name: /end stream/i }))

      await screen.findByRole('button', { name: /enable replay/i })
    })

    it('hides the LIVE NOW banner after ending the stream', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /end stream/i })
      await user.click(screen.getByRole('button', { name: /end stream/i }))

      await waitFor(() => {
        expect(screen.queryByText('LIVE NOW')).not.toBeInTheDocument()
      })
    })

    it('hides the stream player after the stream ends', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /end stream/i })
      await user.click(screen.getByRole('button', { name: /end stream/i }))

      await waitFor(() => {
        expect(
          screen.queryByTestId('stream-preview-player'),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Completed state', () => {
    beforeEach(() => {
      resetStore({
        state: 'completed',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('shows the "Enable Replay" button', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /enable replay/i })
    })

    it('does not show the live player or LIVE NOW banner', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /enable replay/i })
      expect(screen.queryByText('LIVE NOW')).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('stream-preview-player'),
      ).not.toBeInTheDocument()
    })

    it('controls remain locked in completed state', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /enable replay/i })

      const switches = screen.getAllByRole('switch')
      switches.forEach((sw) => expect(sw).toHaveAttribute('data-disabled'))
    })
  })

  describe('Enabling replay', () => {
    beforeEach(() => {
      resetStore({
        state: 'completed',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('transitions to replayAvailable state when "Enable Replay" is clicked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /enable replay/i })
      await user.click(screen.getByRole('button', { name: /enable replay/i }))

      await screen.findByRole('button', { name: /event archived/i })
    })

    it('shows the replay player after enabling replay', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EventDashboard />)
      await screen.findByRole('button', { name: /enable replay/i })
      await user.click(screen.getByRole('button', { name: /enable replay/i }))

      const player = await screen.findByTestId('stream-preview-player')
      expect(player).toHaveTextContent('Replay Stream')
    })
  })

  describe('Replay Available state (terminal)', () => {
    beforeEach(() => {
      resetStore({
        state: 'replayAvailable',
        scheduledAt: '2026-04-15T18:00:00.000Z',
        requirements: ALL_REQUIREMENTS_MET,
      })
    })

    it('shows the "Event Archived" button in a disabled state', async () => {
      renderWithProviders(<EventDashboard />)
      const archivedBtn = await screen.findByRole('button', {
        name: /event archived/i,
      })
      expect(archivedBtn).toBeDisabled()
    })

    it('shows "Replay Available" badge in the event card', async () => {
      renderWithProviders(<EventDashboard />)
      await screen.findByText('Replay Available')
    })
  })
})

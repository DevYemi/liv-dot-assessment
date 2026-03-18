import { createFileRoute } from '@tanstack/react-router'
import { EventDashboard } from '../pages/EventDashboard'

export const Route = createFileRoute('/')({ component: EventDashboard })

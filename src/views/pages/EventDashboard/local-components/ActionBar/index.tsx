import {
  AlertTriangle,
  Radio,
  Square,
  CalendarPlus,
  Play,
  CheckCircle2,
  Archive,
} from 'lucide-react'
import { Button } from '@/views/globalComponents/shadcn-ui/button'
import {
  Alert,
  AlertDescription,
} from '@/views/globalComponents/shadcn-ui/alert'
import type { TEventStateSchema } from '@/data/schemas/event'
import { useActionBar } from './useActionBar'

const ACTION_CONFIG: Record<
  TEventStateSchema,
  {
    label: string
    icon: React.ReactNode
    variant: 'default' | 'destructive' | 'outline'
    description: string
    terminal?: boolean
  }
> = {
  draft: {
    label: 'Schedule Event',
    icon: <CalendarPlus className="h-4 w-4" />,
    variant: 'default',
    description: 'Set a date and time to schedule this event.',
  },
  scheduled: {
    label: 'Mark as Ready',
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: 'default',
    description: 'Confirm all requirements are met to advance to ready state.',
  },
  readyForStreaming: {
    label: 'Go Live',
    icon: <Radio className="h-4 w-4" />,
    variant: 'default',
    description: 'Start broadcasting to your audience.',
  },
  live: {
    label: 'End Stream',
    icon: <Square className="h-4 w-4" />,
    variant: 'destructive',
    description: 'Stop the broadcast and mark the event as completed.',
  },
  completed: {
    label: 'Enable Replay',
    icon: <Play className="h-4 w-4" />,
    variant: 'default',
    description: 'Allow ticket holders to watch the recording.',
  },
  replayAvailable: {
    label: 'Event Archived',
    icon: <Archive className="h-4 w-4" />,
    variant: 'outline',
    description: 'This event has been fully completed and archived.',
    terminal: true,
  },
}

export function ActionBar() {
  const {
    eventData,
    canAdvance,
    isGoLive,
    transitionReason,
    isTransitioning,
    updateEventStateHandler,
  } = useActionBar()
  console.log('eventData.state', eventData.state)
  const config = ACTION_CONFIG[eventData.state]
  const isBlocked = !canAdvance && !config.terminal

  return (
    <div className="space-y-3">
      {isBlocked && transitionReason && (
        <Alert className="border-amber-900/50 bg-amber-950/30 text-amber-400">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-400">
            {transitionReason}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center gap-4">
        <Button
          variant={config.variant}
          size="lg"
          disabled={isBlocked || config.terminal || isTransitioning}
          onClick={updateEventStateHandler}
          className={
            isGoLive && canAdvance
              ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-violet-500 hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]'
              : ''
          }
        >
          {config.icon}
          {config.label}
        </Button>
        <p className="text-sm text-zinc-600">{config.description}</p>
      </div>
    </div>
  )
}

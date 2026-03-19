import { useState } from 'react'
import { EVENT_ID } from '@/constants/dummyData'
import {
  useGetEventByIdQuery,
  useScheduleEventMutation,
  useUpdateEventStateMutation,
} from '@/data/queries/eventQueries'
import { canTransition, getNextState } from '@/utils/eventChunks'

export function useActionBar() {
  const { data: eventData } = useGetEventByIdQuery(EVENT_ID)
  const {
    mutate: updateEventStateTrigger,
    isPending: updateEventStateIsPending,
  } = useUpdateEventStateMutation()
  const {
    mutate: scheduleEventTrigger,
    isPending: scheduleEventIsPending,
  } = useScheduleEventMutation()

  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const transitionCheck = eventData
    ? canTransition(eventData)
    : { allowed: false, reason: undefined }

  const updateEventStateHandler = () => {
    if (!eventData || !transitionCheck.allowed) return
    const nextState = getNextState(eventData.state)
    if (!nextState) return
    updateEventStateTrigger({ id: EVENT_ID, state: nextState })
  }

  const openPicker = () => {
    setSelectedDate(undefined)
    setIsPickerOpen(true)
  }

  const closePicker = () => {
    setIsPickerOpen(false)
    setSelectedDate(undefined)
  }

  const confirmSchedule = () => {
    if (!selectedDate) return
    scheduleEventTrigger(
      { id: EVENT_ID, scheduledAt: selectedDate.toISOString() },
      { onSuccess: () => setIsPickerOpen(false) },
    )
  }

  return {
    eventData: eventData!,
    canAdvance: transitionCheck.allowed,
    transitionReason: transitionCheck.reason,
    isTransitioning: updateEventStateIsPending || scheduleEventIsPending,
    isGoLive: eventData?.state === 'readyForStreaming',
    updateEventStateHandler,
    isPickerOpen,
    setIsPickerOpen,
    selectedDate,
    setSelectedDate,
    openPicker,
    closePicker,
    confirmSchedule,
  }
}

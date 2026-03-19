import { EVENT_ID } from '@/constants/dummyData'
import {
  useGetEventByIdQuery,
  useUpdateEventStateMutation,
} from '@/data/queries/eventQueries'
import { canTransition, getNextState } from '@/utils/eventChunks'

export function useActionBar() {
  const { data: eventData } = useGetEventByIdQuery(EVENT_ID)
  const {
    mutate: updateEventStateTrigger,
    isPending: updateEventStateIsPending,
  } = useUpdateEventStateMutation()

  const transitionCheck = eventData
    ? canTransition(eventData)
    : { allowed: false, reason: undefined }

  const updateEventStateHandler = () => {
    if (!eventData || !transitionCheck.allowed) return
    const nextState = getNextState(eventData.state)
    if (!nextState) return
    updateEventStateTrigger({ id: EVENT_ID, state: nextState })
  }

  return {
    eventData: eventData!,
    canAdvance: transitionCheck.allowed,
    transitionReason: transitionCheck.reason,
    isTransitioning: updateEventStateIsPending,
    isGoLive: eventData?.state === 'readyForStreaming',
    updateEventStateHandler,
  }
}

import type { TRequirementKeySchema } from '@/data/schemas/event'
import {
  useGetEventByIdQuery,
  useUpdateEventStateMutation,
  useUpdateRequirementMutation,
} from '@/data/queries/eventQueries'
import { canTransition, getNextState } from '@/utils/eventChunks'

export const EVENT_ID = 'evt-001'

export function useEventDashboard() {
  const {
    data: eventData,
    isLoading: eventIsLoading,
    isError: eventIsError,
  } = useGetEventByIdQuery(EVENT_ID)
  const {
    mutate: updateEventStateTrigger,
    isPending: updateEventStateIsPending,
  } = useUpdateEventStateMutation()
  const {
    mutate: updateRequirementTrigger,
    isPending: updatedRequirementIsPending,
  } = useUpdateRequirementMutation()

  const transitionCheck = eventData
    ? canTransition(eventData)
    : { allowed: false, reason: undefined }

  const updateEventStateHandler = () => {
    if (!eventData || !transitionCheck.allowed) return
    const nextState = getNextState(eventData.state)
    if (!nextState) return
    updateEventStateTrigger({ id: EVENT_ID, state: nextState })
  }

  const updateRequirementHandler = (key: TRequirementKeySchema) => {
    if (!eventData) return
    const requirement = eventData.requirements.find((r) => r.key === key)
    if (!requirement) return
    updateRequirementTrigger({
      id: EVENT_ID,
      key,
      satisfied: !requirement.satisfied,
    })
  }

  return {
    eventData,
    eventIsLoading,
    eventIsError,
    canAdvance: transitionCheck.allowed,
    transitionReason: transitionCheck.reason,
    isTransitioning: updateEventStateIsPending,
    isTogglingRequirement: updatedRequirementIsPending,
    updateEventStateHandler,
    updateRequirementHandler,
  }
}

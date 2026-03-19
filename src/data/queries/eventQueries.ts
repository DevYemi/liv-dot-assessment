import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  TEventStateSchema,
  TRequirementKeySchema,
} from '#/data/schemas/event'
import { eventService } from '#/data/services/eventService'

export const eventQueryKeys = {
  all: ['events'] as const,
  event: (id: string) => ['events', id] as const,
}

export function useGetEventByIdQuery(id: string) {
  return useQuery({
    queryKey: eventQueryKeys.event(id),
    queryFn: () => eventService.getEventById(id),
  })
}

export function useUpdateEventStateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: TEventStateSchema }) =>
      eventService.updateEventState(id, state),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(
        eventQueryKeys.event(updatedEvent.id),
        updatedEvent,
      )
    },
  })
}

export function useUpdateRequirementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      key,
      satisfied,
    }: {
      id: string
      key: TRequirementKeySchema
      satisfied: boolean
    }) => eventService.updateRequirement(id, key, satisfied),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(
        eventQueryKeys.event(updatedEvent.id),
        updatedEvent,
      )
    },
  })
}

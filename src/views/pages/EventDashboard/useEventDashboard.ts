import { useGetEventByIdQuery } from '@/data/queries/eventQueries'
import { EVENT_ID } from '@/constants/dummyData'

export function useEventDashboard() {
  const {
    data: eventData,
    isLoading: eventIsLoading,
    isError: eventIsError,
  } = useGetEventByIdQuery(EVENT_ID)

  return {
    eventData,
    eventIsLoading,
    eventIsError,
  }
}

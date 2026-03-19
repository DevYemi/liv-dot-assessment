import type { TRequirementKeySchema } from '@/data/schemas/event'
import {
  useGetEventByIdQuery,
  useUpdateRequirementMutation,
  useUpdateThumbnailMutation,
  useUpdateTicketPriceMutation,
} from '@/data/queries/eventQueries'
import { EVENT_ID } from '@/constants/dummyData'
import { useEffect, useRef, useState } from 'react'

export function useRequirementToggle() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [priceInputValue, setPriceInputValue] = useState<string>('')

  const { data: eventData } = useGetEventByIdQuery(EVENT_ID)
  const {
    mutate: updateRequirementTrigger,
    isPending: updatedRequirementIsPending,
  } = useUpdateRequirementMutation()
  const { mutate: updateThumbnailTrigger, isPending: isUpdatingThumbnail } =
    useUpdateThumbnailMutation()
  const { mutate: updateTicketPriceTrigger, isPending: isUpdatingTicketPrice } =
    useUpdateTicketPriceMutation()

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

  const updateThumbnailHandler = (
    e: React.ChangeEvent<HTMLInputElement> | null,
  ) => {
    if (!e) {
      updateThumbnailTrigger({ id: EVENT_ID, thumbnailUrl: null })
      return
    }
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string')
        updateThumbnailTrigger({ id: EVENT_ID, thumbnailUrl: result })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const updateTicketPriceHandler = () => {
    const parsed = parseFloat(priceInputValue)
    if (priceInputValue.trim() === '') {
      updateTicketPriceTrigger({ id: EVENT_ID, ticketPrice: null })
    } else if (!isNaN(parsed) && parsed >= 0) {
      updateTicketPriceTrigger({ id: EVENT_ID, ticketPrice: parsed })
    }
  }

  useEffect(() => {
    if (eventData) {
      setPriceInputValue(eventData.ticketPrice?.toString() || '')
    }
  }, [eventData])

  return {
    eventData: eventData!,
    isTogglingRequirement: updatedRequirementIsPending,
    isUpdatingThumbnail,
    isUpdatingTicketPrice,
    fileInputRef,
    priceInputValue,
    isControlsLocked:
      eventData?.state === 'live' ||
      eventData?.state === 'completed' ||
      eventData?.state === 'replayAvailable',
    setPriceInputValue,
    updateRequirementHandler,
    updateThumbnailHandler,
    updateTicketPriceHandler,
  }
}

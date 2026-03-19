import { z } from 'zod'

export const TEventStateSchemaSchema = z.enum([
  'draft',
  'scheduled',
  'readyForStreaming',
  'live',
  'completed',
  'replayAvailable',
])

export const TRequirementKeySchemaSchema = z.enum([
  'crewAssigned',
  'ingestConfigured',
  'pricingConfigured',
  'thumbnailUploaded',
])

export const RequirementSchema = z.object({
  key: TRequirementKeySchemaSchema,
  label: z.string(),
  description: z.string(),
  satisfied: z.boolean(),
})

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  scheduledAt: z.string().nullable(),
  state: TEventStateSchemaSchema,
  thumbnailUrl: z.string().nullable(),
  viewerCount: z.number(),
  ticketPrice: z.number().nullable(),
  requirements: z.array(RequirementSchema),
})

export type TEventStateSchema = z.infer<typeof TEventStateSchemaSchema>
export type TRequirementKeySchema = z.infer<typeof TRequirementKeySchemaSchema>
export type TRequirementSchema = z.infer<typeof RequirementSchema>
export type TEventSchema = z.infer<typeof EventSchema>

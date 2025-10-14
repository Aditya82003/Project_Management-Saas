import { z } from 'zod'

export const projectIdSchema = z.string().trim().min(1)

export const emojiSchema=z.string().trim().min(1).optional()
export const nameSchema=z.string().trim().min(1).max(255)
export const descriptionSchema=z.string().trim().optional()

export const createProjectSchema=z.object({
    name:nameSchema,
    description:descriptionSchema,
    emoji:emojiSchema
})

export const updateProjectSchema=z.object({
    name:nameSchema.optional(),
    description:descriptionSchema.optional(),
    emoji:emojiSchema.optional()
})


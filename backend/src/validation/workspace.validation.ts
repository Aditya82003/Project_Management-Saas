import { z } from 'zod'

export const nameSchema = z.
    string()
    .trim()
    .min(1,{message:"Name is required"})
    .max(50);

export const descriptionSchema = z.
    string()
    .trim()
    .min(1,{message:"Description is required"});

export const changeRoleSchema = z.object({
    roleId:z.string().trim().min(1),
    memberId:z.string().trim().min(1)
})

export const createWorkspaceSchema=z.object({
    name:nameSchema,
    description:descriptionSchema
})
 export const updateWorkspaceSchema=z.object({
    name:nameSchema,
    description:descriptionSchema
})

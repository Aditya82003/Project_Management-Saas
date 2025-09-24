import z from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma";

export const titleSchema = z.string().trim().min(1).max(255)
export const descriptionSchema = z.string().trim().min(1).optional()

export const assignTaskSchema = z.string().trim().min(1).nullable().optional()

export const prioritySchema = z.enum([
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH
])


export const statusSchema = z.enum([
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
])

export const dueDate = z.preprocess(
    (val) => {
        if (!val) return undefined
        if (val instanceof Date) return val
        return new Date(val as string)
    },
    z.date().optional()
)
export const taskIdSchema = z.string().trim().min(1)

export const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
    assignedToId: assignTaskSchema,
    dueDate: dueDate,
})

export const updateTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedToId: assignTaskSchema,
    dueDate: dueDate,
})
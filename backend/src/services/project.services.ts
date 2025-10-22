import { TaskStatus } from "../generated/prisma"
import prisma from "../prisma/cilent.prisma"
import { NotFoundException } from "../utilities/appError"

export const createProjectService = async (
    userId: string,
    workspaceId: string,
    body: {
        name: string,
        description?: string,
        emoji?: string
    }
) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    const project = await prisma.project.create({
        data: {
            workspaceId,
            name: body.name,
            description: body.description,
            emoji: body.emoji,
            createdById: userId
        }
    })
    return { project }
}

export const updateProjectService = async (
    workspaceId: string,
    projectId: string,
    body: {
        name?: string,
        description?: string,
        emoji?: string
    }
) => {
    const { name, description, emoji } = body

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId
        }
    })
    if (!project) {
        throw new NotFoundException("Project not found")
    }
    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(emoji !== undefined && { emoji })
        }
    })
    return { project: updatedProject }
}

export const deleteProjectService = async (workspaceId: string, projectId: string) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId
        }
    })
    if (!project) {
        throw new NotFoundException("Project not found")
    }
    const deletedProject = await prisma.project.delete({
        where: { id: projectId }
    })
    return { project: deletedProject }
}

export const getProjectsInWorkspaceService = async (
    workspaceId: string,
    pageSize: number,
    pageNumber: number
) => {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId }
    })
    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }
    const totalCount = await prisma.project.count({
        where: {
            workspaceId,
        }
    })

    const skip = (pageNumber - 1) * pageSize

    const projects=await prisma.project.findMany({
        where:{
            workspaceId
        },
        skip,
        take:pageSize,
        orderBy: {
            createdAt: 'desc'
        },
        include:{
            createdBy:{
                select:{
                    id:true,
                    name:true,
                    profilePicture:true
                }
            }
        }
    })

    const totalPages = Math.ceil(totalCount / pageSize)
    return { projects, totalCount, totalPages,skip }

}

export const getProjectByIdService = async (workspaceId: string, projectId: string) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId
        },
        select:{
            id: true,
            name: true,
            description: true,
            emoji: true,
        }
    })
    if (!project) {
        throw new NotFoundException("Project not found or does not exist in this workspace")
    }
    return { ...project }
} 

export const getProjectAnalyticsService = async (
    workspaceId: string,
    projectId: string) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId
        }
    })
    if (!project) {
        throw new NotFoundException("Project not found or does not exist in this workspace")
    }
    const currentDate=new Date()

    const [totalTasks,overdueTask,completedTask]=await prisma.$transaction([
        prisma.task.count({
            where:{
                projectId
            }
        }),
        prisma.task.count({
            where:{
                projectId,
                dueDate:{
                    lt:currentDate
                },
                status:{
                    not:TaskStatus.DONE
                }
            }
        }),
        prisma.task.count({
            where:{
                projectId,
                status:TaskStatus.DONE
            }
        })
    ])

    const analytics={
        totalTasks,
        overdueTask,
        completedTask
    }

    return { analytics }
}
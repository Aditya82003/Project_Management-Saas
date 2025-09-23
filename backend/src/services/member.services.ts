import { RoleType } from "../generated/prisma"
import prisma from "../prisma/cilent.prisma"
import { BadRequestException, NotFoundException } from "../utilities/appError"

export const getMemberRoleInWorkspaceService = async (userId: string, workspaceId: string) => {
    const workspace = await prisma.workspace.findUnique({
        where:{id:workspaceId},
    })
    if(!workspace){
        throw new NotFoundException("Workspace not found")
    }
    const member=await prisma.member.findFirst({
        where:{workspaceId,userId},
        include:{role:{
            select:{
                id:true,
                role:true
            }
        }}
    })
    if(!member){
        throw new NotFoundException("Member not found")
    }
    const roleName=member.role.role
    return {role:roleName}
}

export const joinWorkspaceByInviteService=async(inviteCode:string,userId:string)=>{
    const workspace=await prisma.workspace.findFirst({
        where:{
            inviteCode:inviteCode
        }
    })
    if(!workspace){
        throw new NotFoundException("Workspace not found")
    }
    const existingMember=await prisma.member.findFirst({
        where:{
            workspaceId:workspace.id,
            userId:userId
        }
    })
    if(existingMember){
        throw new BadRequestException("You are already a member of this workspace")
    }
    const role=await prisma.role.findFirst({
        where:{
            role:RoleType.MEMBER
        }
    })
    if(!role){
        throw new NotFoundException("Role not found")
    }
    const member=await prisma.member.create({
        data:{
            workspaceId:workspace.id,
            userId,
            roleId:role.id
        }
    })
    return {
        workspaceId:workspace.id,
        role:role.role
    }
    
}

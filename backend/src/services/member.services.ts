import prisma from "../prisma/cilent.prisma"
import { NotFoundException } from "../utilities/appError"

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

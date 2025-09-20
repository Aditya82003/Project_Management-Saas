import { ProviderEnumType } from "../enums/account-provider.enum";
import { Provider, RoleType } from "../generated/prisma";
import prisma from "../prisma/cilent.prisma";
import { NotFoundException } from "../utilities/appError";
import { comparedPassword } from "../utilities/comparePassword";
// import { generateInviteCode } from "../utilities/uuid";

export const loginOrCreateAccouunt=async(data:{
    provider:Provider,
    displayName:string,
    providerId:string,
    picture?:string,
    email?:string
})=>{
    const {provider,providerId,displayName,picture,email}=data

    return await prisma.$transaction(async (ts)=>{
        let user =await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            user=await ts.user.create({
                data:{
                    name:displayName,
                    email:email as string,
                    profilePicture:picture,
                }
            })
            await ts.accountProvider.create({
                data:{
                    provider,
                    providerId,
                    userId:user.id
                }
            })
            const workspace=await ts.workspace.create({
                data:{
                    name:"My workspace",
                    description:`Workspace created for ${user.name}`,
                    ownerId:user.id,
                    inviteCode:""
                }
            })
            const ownerRole=await ts.role.findUnique({
                where:{role:RoleType.OWNER}
            })
            if(!ownerRole){
                throw new Error("Owner role not found")
            }
            const member=await ts.member.create({
                data:{
                    userId:user.id,
                    workspaceId:workspace.id,
                    roleId:ownerRole.id,
                    joinedAt:new Date()
                }
            })
            user=await ts.user.update({
                where:{id:user.id},
                data:{currentWorkspaceId:workspace.id}     
            })
        }

        return {user}
    })
}

export const verifyUserService= async({email,password,provider=Provider.EMAIL}:{email:string,password:string,provider?:Provider})=>{
    const account=await prisma.accountProvider.findFirst({
        where:{
            provider:provider,
            providerId:email}
    })
    if(!account){
        throw new NotFoundException("Invalid email or password")
    }
    const user = await prisma.user.findUnique({
        where:{
            id:account.userId
        }
    })
    if(!user){
        throw new NotFoundException("User not found for the given account")
    }
    const isMatched=await comparedPassword(password,user.password as string)
    if(!isMatched){
        throw new NotFoundException("Invalid email or password")
    }
    const {password:_,...rest}=user
    return rest
}
import prisma from "../prisma/cilent.prisma"
import { BadRequestException } from "../utilities/appError"

export const fetchCurrentUser = async (userId:string) => {
    const user =await prisma.user.findUnique({
        where:{id:userId},
        include:{
            currentWorkspace:true,
        }
    })
    if(!user){
        throw new BadRequestException("User not found")
    }
    return {user}
}
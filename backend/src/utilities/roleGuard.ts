import { PermissionType } from "../generated/prisma";
import { UnauthorizedException } from "./appError";
import { rolePremission } from "./role-permission";

export const roleGuard = (
    role: keyof typeof rolePremission,
    requiredPermission: PermissionType[]
) => {
    const permissions = rolePremission[role]

    const hasPermission=requiredPermission.every(permission=>permissions.includes(permission))
    if(!hasPermission){
        throw new UnauthorizedException("You don't have permission to perform this action")
    }
}
import type { PermissionType, Role } from "@/constant"
import type { UserType, WorkspaceWithMembersType } from "@/types/api.types"
import { RolePermissions } from "@/utilis/role-permission"
import { useEffect, useMemo, useState } from "react"

const usePermission = (
    user: UserType | undefined,
    workpsace: WorkspaceWithMembersType | undefined
) => {
    const [permissions, setPermissions] = useState<PermissionType[]>([])

    useEffect(() => {
        if (user && workpsace) {
            const member = workpsace.members.find(member => member.userId === user.id)
            const memberRole = member?.role.role

            if (memberRole) {
                setPermissions(RolePermissions[memberRole as Role])
            }
        }
    }, [user, workpsace])

    return useMemo(() => permissions, [permissions])
}

export default usePermission
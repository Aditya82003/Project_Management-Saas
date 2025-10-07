import type { PermissionType } from "@/constant"
import { useAuthContext } from "@/context/auth-provider"

type PermissionGuardProps = {
    requiredPermission: PermissionType
    children: React.ReactNode
    showMessage?: boolean
}
const PermissionGuard: React.FC<PermissionGuardProps> = ({
    requiredPermission,
    children,
    showMessage = false
}) => {
    const { hasPermission } = useAuthContext()
    if (!hasPermission(requiredPermission)) {
        return showMessage && (
            <div className="text-center text-sm pt-3 italic w-full text-muted-foreground">
                You do not have the Permission to view this
            </div>
        )
    }
    return <>{children}</>
}
export default PermissionGuard
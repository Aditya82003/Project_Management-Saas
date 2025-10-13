import PermissionGuard from "@/components/resuable/permission-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Permissions } from "@/constant"
import { useAuthContext } from "@/context/auth-provider"
import { BASE_ROUTES } from "@/routes/common/routePaths"
import { CheckIcon, CopyIcon, Loader } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const InviteMember = () => {
    const { workspace, workspaceLoading } = useAuthContext()
    const [copied, setCopied] = useState(false)

    const inviteUrl = workspace ? `${window.location.origin}${BASE_ROUTES.INVITE_URL.replace(":inviteCode", workspace.inviteCode)}` : ""

    const handleCopy = () => {
        if (inviteUrl) {
            navigator.clipboard.writeText(inviteUrl).then(() => {
                setCopied(true)
                toast.success("Copied to clipboard")
                setTimeout(() => setCopied(false), 2000)
            })
        }
    }

    return (
        <div className="flex flex-col pt-0.5 px-0">
            <h5 className="text-lg leading-[30px] font-semibold mb-1">
                Invite member to join you
            </h5>
            <p className="text-sm text-muted-foreground leading-tight">
                Anyone with an invite link can join this free Workspace. You can also
                disable and create a new invite link for this Workspace at any time.
            </p>

            <PermissionGuard showMessage requiredPermission={Permissions.ADD_MEMBER}>
                {workspaceLoading ? (
                    <Loader
                        className="w-8 h-8 animate-spin place-self-center flex" />
                ) : (
                    <div className="flex py-3 gap-2">
                        <Label htmlFor="link" className="sr-only">Link</Label>
                        <Input
                            id="link"
                            disabled={true}
                            value={inviteUrl}
                            readOnly
                            className="disable:opacity-100 disable:pointer-events-none" />
                        <Button
                            disabled={false}
                            className="shrink-0"
                            size="icon"
                            onClick={handleCopy}>
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </Button>
                    </div>
                )}
            </PermissionGuard>
        </div>
    )
}

export default InviteMember
import { ConfirmDialog } from "@/components/resuable/confirm-dialog"
import PermissionGuard from "@/components/resuable/permission-guard"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/constant"
import { useAuthContext } from "@/context/auth-provider"
import useConfirmDialog from "@/hooks/use-confirm-dialog"
import useWorkspaceId from "@/hooks/use-worksapce-id"
import { deleteWorkspaceMutationFn } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

const DeleteWorkspaceCard = () => {
    const {workspace}=useAuthContext()
    const navigate=useNavigate()

    const queryClient = useQueryClient()
    const workspaceId=useWorkspaceId()

    const {open,onOpenDialog,onCloseDialog}=useConfirmDialog()

    const {mutate,isPending}=useMutation({
        mutationFn:deleteWorkspaceMutationFn
    })
    const handleConfirm=()=>{
        mutate(workspaceId,{
            onSuccess:(data)=>{
                queryClient.invalidateQueries({
                    queryKey:["userWorkspaces"]
                })
                navigate(`/workspace/${data.currentWorkspace.id}`)
                setTimeout(()=>onCloseDialog(),500)
                toast.success("Workspace deleted successfully")
            },
            onError:(error)=>{
                toast.error(error.message)
            }
        })
    }
    return (
        <>
        <div className="w-full">
            <div className="mb-5 border-b">
                <h1 className="text-[17px] tracking-[-0.16px] font-semibold mb-1.5 text-center sm:text-left dark:text-[#fcfdffef]">Delete Workspace</h1>
            </div>
            <PermissionGuard requiredPermission={Permissions.DELETE_WORKSPACE}>
                <div className="flex flex-col items-start justify-between py-0">
                    <div className="flex-1 mb-4">
                        <p> Deleting a workspace is a permanent action and cannot be undone.
                            Once you delete a workspace, all its associated data, including
                            projects, tasks, and member roles, will be permanently removed.
                            Please proceed with caution and ensure this action is
                            intentional.</p>
                    </div>
                    <Button className="shrink-0 place-self-end h-[40px]"
                    variant={"destructive"}
                    onClick={onOpenDialog}>
                        Delete Workspace
                    </Button>
                </div>
            </PermissionGuard>
        </div>
        <ConfirmDialog
            isOpen={open}
            onClose={onCloseDialog}
            isLoading={isPending}
            onConfirm={handleConfirm}
            title={`Delete ${workspace?.name} workspace`}
            description={`Are you sure you want to delete ${workspace?.name} workspace? This action cannot be undone.`}
            confirmText="Delete Workspace"
            cancelText="Cancel"
        />
        </>
    )
}
export default DeleteWorkspaceCard
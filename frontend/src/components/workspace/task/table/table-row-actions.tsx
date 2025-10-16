import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useWorkspaceId from "@/hooks/use-worksapce-id";
import { deleteTaskMutationFn } from "@/lib/api";
import type { TaskType } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import {  MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditTaskDialog from "../edit-task-dialog";

interface DataTableRowActionsProps {
    row: Row<TaskType>
}
export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const queryClient = useQueryClient();
    const workspaceId = useWorkspaceId()

    const { mutate, isPending } = useMutation({
        mutationFn: deleteTaskMutationFn
    })
    const task = row.original
    const taskId = task.id
    const taskCode = task.taskCode

    const handleConfirm = () => {
        mutate({ workspaceId, taskId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["all-tasks", workspaceId],
                });
                toast.success("Task deleted successfully")
                setTimeout(() => {
                    setOpenDeleteDialog(false)
                }, 100);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem className="cursor-pointer" onClick={()=> setOpenEditDialog(true)}>
                        <Pencil className="w-4 h-4 mr-2" />Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer !text-destructive" onClick={()=> setOpenDeleteDialog(true)}>
                        Delete Task
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

             <EditTaskDialog task={task} isOpen={openEditDialog} onClose={() => setOpenEditDialog(false)} />

            <ConfirmDialog
                isOpen={openDeleteDialog}
                isLoading={isPending}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleConfirm}
                title="Delete Task"
                description={`Are you sure you want to delete ${taskCode}?`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    )
}

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { TaskType } from "@/types/api.types"
import EditTaskForm from "./edit-task-form"

interface EditTaskDialogProps {
    task: TaskType
    isOpen: boolean
    onClose: () => void
}
const EditTaskDialog = ({ task, isOpen, onClose }: EditTaskDialogProps) => {
    return (
        <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
                <DialogTitle className="sr-only hidden">Edit Task</DialogTitle>
                <EditTaskForm task={task} onClose={onClose} />
            </DialogContent>
        </Dialog>

    )
}

export default EditTaskDialog
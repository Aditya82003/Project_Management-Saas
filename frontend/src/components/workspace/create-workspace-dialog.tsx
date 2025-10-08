import useCreateWorkspaceDialog from "@/hooks/use-create-workpsace-dialog"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import WorkspaceForm from './create-workspace-form'

const CreateWorkspaceDialog = () => {
    const {open,onClose}=useCreateWorkspaceDialog()
  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-5xl !p-0 overflow-hidden border-0">
        <DialogTitle className="sr-only">Create Workspace</DialogTitle>
            <WorkspaceForm {...{onClose}}/>
        </DialogContent>
    </Dialog>
    
  )
}

export default CreateWorkspaceDialog
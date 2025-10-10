import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { ProjectType } from "@/types/api.types"
import { Edit3 } from "lucide-react"
import { useState } from "react"
import EditProjectForm from "./edit-project-form"

const EditProjectDialog=(props:{project?:ProjectType})=>{
    const [isOpen, setIsOpen] = useState(false)

    const onClose = ()=>{
        setIsOpen(false)
    }
    return (
        <div>
            <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="mt-1.5" asChild>
                    <button ><Edit3 className="w-5 h-5"/></button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg border-0">
                    <DialogTitle className="hiddden sr-only">Edit Project</DialogTitle>
                    <EditProjectForm onClose={onClose} project={props.project}/>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditProjectDialog
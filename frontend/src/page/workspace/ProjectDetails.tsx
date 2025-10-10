import { Separator } from "@/components/ui/separator"
import ProjectHeader from "@/components/workspace/project/project-header"

const ProjectDetails = () => {
    return (
        <div className="w-full space-y-6 py-4 md:pt-3">
            <ProjectHeader/>
            <div>
                <h1>Project Analyitc</h1>
                <Separator />
                <h1>Task Table</h1>
            </div>
        </div>
    )
}

export default ProjectDetails
import DeleteWorkspaceCard from "@/components/workspace/common/delete-workspace-card"
import WorkspaceHeader from "@/components/workspace/common/workspace-header"
import EditWorkspaceForm from "@/components/workspace/edit-workspace-form"

const Settings = () => {
  return (
    <div className="w-full h-auto py-2">
        <WorkspaceHeader/>
        <main>
            <div className="ww-full max-w-3xl mx-auto py-3">
                <h2 className="text-[20px] leading-[30px] font-semibold mb-3">Workspace Setting</h2>
                <div className="flex flex-col pt-0.5 px-0">
                    <div className="pt-2">
                        <EditWorkspaceForm/>
                    </div>
                    <div className="pt-2">
                        <DeleteWorkspaceCard/>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default Settings
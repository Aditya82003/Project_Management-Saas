import { Separator } from "@/components/ui/separator"
import WorkspaceHeader from "@/components/workspace/common/workspace-header"
import Allmembers from "@/components/workspace/member/all-members"
import InviteMember from "@/components/workspace/member/invite-members"

const Members = () => {
  return (
    <div className="w-full h-auto pt-2">
      <WorkspaceHeader />
      <Separator className="my-4" />
      <main>
        <div className="w-full max-w-3xl mx-auto pt-3">
          <div>
            <h2 className="text-lg leading-[30px] font-semibold mb-1">
              Workspace Members
            </h2>
            <p className="text-sm text-muted-foreground">
              Workspace members can view and join all workspace project,tasks and create new task in the workspace
            </p>
          </div>
          <Separator className="my-4" />
          <InviteMember />
          <Separator className="my-4 !h-[0.5px]" />
          <Allmembers />
        </div>
      </main>
    </div>
  )
}

export default Members
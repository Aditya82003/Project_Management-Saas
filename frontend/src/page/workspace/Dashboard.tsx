import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecentProject from "@/components/workspace/project/recent-project"
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics"
import useCreateProjectDialog from "@/hooks/use-create-project-dialog"
import { TabsContent } from "@radix-ui/react-tabs"
import { Plus } from "lucide-react"

const Dashboard = () => {
  const {onOpen}=useCreateProjectDialog()
  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workspace Overview</h2>
          <p className="text-muted-foreground">Here&apos; an overview for this Workspace</p>
        </div>
        <Button onClick={onOpen}>
          <Plus />
          New Project
        </Button>
      </div>
      <WorkspaceAnalytics />
      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full border rounded-lg p-2">
          <TabsList className="w-full justify-start border-0 bg-gray-50 px-1 h-12">
            <TabsTrigger className="py-2" value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">Tasks</TabsTrigger>
            <TabsTrigger className="py-2" value="members">Recent Members</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentProject/>
          </TabsContent>
          <TabsContent value="tasks"></TabsContent>
          <TabsContent value="members"></TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default Dashboard
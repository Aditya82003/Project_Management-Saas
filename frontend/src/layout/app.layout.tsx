import AppSidebar from "@/components/sidebar/AppSidebar"
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog"
import { Outlet } from "react-router"

const AppLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="w-full">
                    <>
                        <h1>Header</h1>
                        <div className="px-3 lg:px-20 py-3">
                            <Outlet />
                        </div>
                    </>
                    <CreateWorkspaceDialog />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )

}

export default AppLayout
import Header from "@/components/header"
import AppSidebar from "@/components/sidebar/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog"
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog"
import { AuthProvider } from "@/context/auth-provider"
import { Outlet } from "react-router"

const AppLayout = () => {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="w-full">
                        <>
                            <Header/>
                            <div className="px-3 lg:px-20 py-3">
                                <Outlet />
                            </div>
                        </>
                        <CreateWorkspaceDialog />
                        <CreateProjectDialog />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    )

}

export default AppLayout
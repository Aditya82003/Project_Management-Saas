import AppSidebar from "@/components/sidebar/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

const AppLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <div className="w-full">
                <h1>Header</h1>
                    <SidebarTrigger/>
                <div className="px-3 lg:px-20 py-3">
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    )

}

export default AppLayout
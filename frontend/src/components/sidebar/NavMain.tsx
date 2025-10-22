
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { CheckCircle, LayoutDashboard, Settings, Users, VideoIcon, type LucideIcon } from 'lucide-react'
import useWorkspaceId from '@/hooks/use-worksapce-id'
import { Link } from 'react-router'
import { useAuthContext } from '@/context/auth-provider'
import { Permissions } from '@/constant'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type ItemType = {
    title: string
    url: string
    icon: LucideIcon
}
const NavMain = () => {
    const { hasPermission } = useAuthContext()

    const canManageSettings = hasPermission(Permissions.MANAGE_WORKSPACE_SETTINGS)
    const {open:sidebarOpen} = useSidebar()

    const pathname = location.pathname
    const workspaceId = useWorkspaceId()

    const items: ItemType[] = [
        {
            title: "Workspace",
            url: `/workspace/${workspaceId}`,
            icon: LayoutDashboard
        },
        {
            title: "Tasks",
            url: `/workspace/${workspaceId}/tasks`,
            icon: CheckCircle
        },
        {
            title: "Members",
            url: `/workspace/${workspaceId}/members`,
            icon: Users
        },
        ...(canManageSettings ? [
            {
                title: "Settings",
                url: `/workspace/${workspaceId}/settings`,
                icon: Settings,
            },
        ] : []),
        {
            title:"Video Call",
            url:`/workspace/${workspaceId}/video-call`,
            icon: VideoIcon
        }
    ]
    return (
        <SidebarGroup className='pl-0'>
            <SidebarMenu>
                {items.map((item) => (
                    <Tooltip key={item.title} open={sidebarOpen ? false : undefined}>
                        <TooltipTrigger asChild>
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton isActive={item.url === pathname} asChild>
                                    <Link to={item.url} className="!text-[15px]">
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side='right'>{item.title}</TooltipContent>
                    </Tooltip>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default NavMain
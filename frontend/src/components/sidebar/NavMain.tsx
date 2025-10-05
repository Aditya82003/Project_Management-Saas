
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { CheckCircle, LayoutDashboard,Users, type LucideIcon } from 'lucide-react'
import useWorkspaceId from '@/hooks/use-worksapce-id'
import { Link } from 'react-router'

type ItemType={
    title:string
    url:string
    icon:LucideIcon
}
const NavMain = () => {
    const pathname=location.pathname
    const workspaceId=useWorkspaceId()

    const items:ItemType[]=[
        {
            title:"Workspace",
            url:`/workspace/${workspaceId}`,
            icon:LayoutDashboard
        },
        {
            title:"Tasks",
            url:`/workspace/${workspaceId}/tasks`,
            icon:CheckCircle
        },
        {
            title:"Members",
            url:`/workspace/${workspaceId}/members`,
            icon:Users
        }
    ]
  return (
    <SidebarGroup className='pl-0'>
        <SidebarMenu>
            {items.map((item)=>(
                <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton isActive={item.url===pathname} asChild>
                    <Link to={item.url} className="!text-[15px]">
                        <item.icon/>
                        <span>{item.title}</span>
                    </Link>
                    </SidebarMenuButton> 
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
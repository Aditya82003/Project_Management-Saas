import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { useState } from "react";
import { Link } from "react-router";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Separator } from "../ui/separator";
import NavMain from "./NavMain";
import NavProjects from "./NavProjects";
import useWorkspaceId from "@/hooks/use-worksapce-id";



const AppSidebar = () => {
  const workspaceId=useWorkspaceId()
  const {open}=useSidebar()
  const [isOpen, setIsopen] = useState(true);
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="!py-0 dark:bg-background">
          <div className="flex gap-2 items-center justify-start w-full px-1 h-[50px]">
            <Logo url={`/workspace/${workspaceId}`}/>
            {open &&(
              <Link to={`/workspace/${workspaceId}`} className="hidden md:flex ml-2 items-center gap-2 self-center font-medium">Team Sync.</Link>
            )
            }                       
          </div> 
        </SidebarHeader>
      <SidebarContent className="!mt-0 dark:bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <WorkspaceSwitcher/>
            <Separator/>
            <NavMain/>
            <Separator/>
            <NavProjects/>
            <Separator/>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="dark:bg-background">
        <SidebarMenu>
            <SidebarMenuItem>
              
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

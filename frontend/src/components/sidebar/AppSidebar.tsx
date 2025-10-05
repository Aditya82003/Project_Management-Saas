import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { useState } from "react";
import { Link } from "react-router";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Separator } from "../ui/separator";
import NavMain from "./NavMain";
import NavProjects from "./NavProjects";



const AppSidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="!py-0 dark:bg-background">
          <div className="flex gap-2 items-center justify-start w-full px-1 h-[50px]">
            <Logo url={`/workspace/123456`}/>
            {open &&(
              <Link to={`/workspace/123456`} className="hidden md:flex ml-2 items-center gap-2 self-center font-medium">Team Sync.</Link>
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
    </Sidebar>
  );
};

export default AppSidebar;

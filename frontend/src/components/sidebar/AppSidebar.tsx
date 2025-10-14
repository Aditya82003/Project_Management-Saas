import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
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
import { useAuthContext } from "@/context/auth-provider";
import { EllipsisIcon, Loader, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogoutDialog from "./logout-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const AppSidebar = () => {
  const { isLoading, user } = useAuthContext()

  const workspaceId = useWorkspaceId()
  const { open } = useSidebar()

  const [isOpen, setIsopen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="!py-0 dark:bg-background">
          <div className="flex gap-2 items-center justify-start w-full px-1 h-[50px]">
            <Logo url={`/workspace/${workspaceId}`} />
            {open && (
              <Link to={`/workspace/${workspaceId}`} className="hidden md:flex ml-2 items-center gap-2 self-center font-medium">Team Sync.</Link>
            )
            }
          </div>
        </SidebarHeader>
        <SidebarContent className="!mt-0 dark:bg-background">
          <SidebarGroup>
            <SidebarGroupContent>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <WorkspaceSwitcher />
                </TooltipTrigger>
                <TooltipContent>Workspace</TooltipContent>
              </Tooltip>
              <Separator />
              <NavMain />
              <Separator />
              <NavProjects />
              <Separator />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="dark:bg-background">
          <SidebarMenu>
            <SidebarMenuItem>
              {
                isLoading ? (
                  <Loader
                    size={24}
                    className="place-self-center self-center animate-spin"
                  />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="w-8 h-8 rounded-full">
                          <AvatarImage src={user?.profilePicture || ""} />
                          <AvatarFallback className="border broder-grey-500 rounded-full">
                            {user?.name.split(" ")?.[0]?.charAt(0)}
                            {user?.name.split(" ")?.[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.name}
                          </span>
                          <span className="truncate text-xs">{user?.email}</span>
                        </div>
                        <EllipsisIcon className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side={"bottom"}
                      align="start"
                      sideOffset={4}>
                      <DropdownMenuGroup></DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setIsopen(true)}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <LogoutDialog isOpen={isOpen} setIsOpen={setIsopen} />
    </>
  );
};

export default AppSidebar;

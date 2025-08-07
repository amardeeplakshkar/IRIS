"use client"

import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTRPC } from "@/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavProjects() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const { user } = useUser()
  const trpc = useTRPC();
  const { data: chats } = useQuery(trpc.chat.getMany.queryOptions());
  if (!user) return null;
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {chats?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton className={cn("", pathname === `/chat/${item.id}` && "bg-sidebar-accent text-sidebar-accent-foreground")} asChild>
              <a href={`/chat/${item.id}`}>
                <Folder />
                <span>{item?.messages[0]?.content}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

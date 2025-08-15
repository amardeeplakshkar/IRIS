"use client"

import * as React from "react"
import {
  Image,
  MessageSquareIcon,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { Button } from "../ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const data = {
    user: {
      name: user?.fullName || "User",
      email: user?.emailAddresses[0].emailAddress || "user@amardeep.space",
      avatar: user?.imageUrl || "",
    },
    navMain: [
      {
        title: "New Chat",
        url: "/",
        icon: MessageSquareIcon,
      },
      {
        title: "Library",
        url: "/library",
        icon: Image,
      },
      // {
      //   title: "Documentation",
      //   url: "#",
      //   icon: BookOpen,
      //   items: [
      //     {
      //       title: "Introduction",
      //       url: "#",
      //     },
      //     {
      //       title: "Get Started",
      //       url: "#",
      //     },
      //     {
      //       title: "Tutorials",
      //       url: "#",
      //     },
      //     {
      //       title: "Changelog",
      //       url: "#",
      //     },
      //   ],
      // },
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "General",
      //       url: "#",
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //     },
      //   ],
      // },
    ],
    navSecondary: [
      {
        title: "Support & Feedback",
        url: "https://github.com/amardeeplakshkar/IRIS/issues/new",
        icon: Send,
      },
    ],   
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/logo-light.png" className="size-7" alt="iris ai chat bot logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">IRIS</span>
                  <span className="truncate text-xs">AI Assistant</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects/>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SignedIn>
        <NavUser user={data.user} />
        </SignedIn>
        <SignedOut>
          <Button asChild variant={'secondary'}>
          <SignUpButton/>
          </Button>
          <Button asChild variant={"outline"}>
          <SignInButton/>
          </Button>
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  )
}

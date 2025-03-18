"use client"
import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { Home } from "lucide-react"
import Link from "next/link"

export default function HeaderSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={cn(
          "text-muted-foreground font-bold uppercase tracking-wide",
          isCollapsed ? "flex justify-center text-xs" : "text-sm"
        )}
      >
        {isCollapsed ? <Home className="size-5" /> : "SpecLoop"}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="size-4" />
                <span className="truncate">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

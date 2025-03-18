"use client"
import { FileText, Settings } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import React from "react"
import { cookies } from "next/headers"
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { ThemeSwitcher } from "@/components/utilities/theme-switcher"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function DashboardSidebarFooter() {
  const params = useParams<{ projectId: string }>()
  return (
    <SidebarFooter className="text-muted-foreground text-xs">
      <SidebarMenu>
        {/* <SidebarMenuItem>
          <SidebarMenuButton asChild className="w-full">
            <Link
              href={`/project/${params.projectId}/documents`}
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              <span>Additional Documents</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
        <SidebarMenuItem className="border-t pt-4">
          <SidebarMenuButton asChild className="w-full">
            <Link href="/onboarding" className="flex items-center gap-2">
              <Settings className="size-6" />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="flex items-center justify-center gap-2">
        <ThemeSwitcher />
      </div>
      <div className="flex items-center justify-center">
        <span>
          Press{" "}
          <kbd className="bg-muted rounded border px-1 py-0.5">Ctrl/⌘</kbd>+
          <kbd className="bg-muted rounded border px-1 py-0.5">B</kbd> to toggle
        </span>
      </div>
    </SidebarFooter>
  )
}

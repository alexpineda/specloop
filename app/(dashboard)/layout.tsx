"use server"

import React from "react"
import { cookies } from "next/headers"
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarInset
} from "@/components/ui/sidebar"
import HeaderSidebar from "./_components/sidebar.header"
import { ThemeSwitcher } from "@/components/utilities/theme-switcher"
import DashboardSidebarFooter from "./_components/sidebar.footer"
import SessionSidebar from "./_components/sidebar.session"
import {
  getSettingsAction,
  saveSettingsAction
} from "@/actions/db/settings-actions"
import { redirect } from "next/navigation"
import { defaultSettings } from "@/types/settings-types"
import ErrorPage from "./_components/error-page"

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  // Get the sidebar state from cookies for persistence using Next.js cookies API
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar:state")
  const defaultOpen = sidebarCookie?.value === "true"

  const settings = await getSettingsAction()
  if (!settings.isSuccess) {
    if (settings.message === "No settings found") {
      // Create default settings
      await saveSettingsAction(defaultSettings)

      redirect("/onboarding")
    } else {
      throw new Error(
        `You may need to run npm run db:migrate. ${settings.message}`
      )
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar variant="sidebar" collapsible="icon" className="border-r">
          <SidebarContent>
            <HeaderSidebar />
            <SessionSidebar />
          </SidebarContent>
          <DashboardSidebarFooter />
        </Sidebar>
        <SidebarInset className="bg-background overflow-auto">
          <SidebarTrigger />
          <div className="mx-auto w-full  px-4 ">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

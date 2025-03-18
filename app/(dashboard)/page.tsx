"use server"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getProjectsAction } from "@/actions/db/projects-actions"
import ProjectsList from "./_components/projects-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar"
import { Home, FolderPlus, Settings, FileCode, HelpCircle } from "lucide-react"
import { ThemeSwitcher } from "@/components/utilities/theme-switcher"

// A fallback skeleton for loading states
function SessionsSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="mb-4 h-6 w-1/3" />
      <Skeleton className="mb-2 h-5 w-1/2" />
      <Skeleton className="mb-2 h-5 w-1/2" />
      <Skeleton className="mb-2 h-5 w-1/3" />
      <Skeleton className="mt-6 h-10 w-1/4" />
    </div>
  )
}

export default async function SpecloopIndexPage() {
  return (
    <div className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/new">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            <FolderPlus className="mr-2 size-4" />
            Create New Project
          </Button>
        </Link>
      </div>

      <Suspense fallback={<SessionsSkeleton />}>
        <ProjectsFetcher />
      </Suspense>
    </div>
  )
}

async function ProjectsFetcher() {
  const sessionsRes = await getProjectsAction()
  const sessions = sessionsRes.isSuccess ? sessionsRes.data : []

  return <ProjectsList projects={sessions} />
}

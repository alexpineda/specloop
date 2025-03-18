"use client"
/**
 * @file sessions-list.tsx
 * @description
 * A client component that displays a stylized list of the user's existing sessions.
 * If none exist, shows a polished empty state message.
 *
 * Key features:
 * - Renders each session as a link to /specloop/[projectId]
 * - Uses a card-like container with spacing
 * - Shows an empty state if there are no sessions
 *
 * @notes
 * - Part of Step 29: Overhauling the dashboard UI to look nicer
 */

import { useState } from "react"
import Link from "next/link"
import { SelectProject } from "@/db/schema/projects-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pencil,
  Trash2,
  X,
  Check,
  MoreVertical,
  FileCode,
  Clock,
  Calendar
} from "lucide-react"
import {
  deleteProjectAction,
  updateProjectAction
} from "@/actions/db/projects-actions"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface SessionsListProps {
  projects: SelectProject[]
}

export default function ProjectsList({ projects }: SessionsListProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // If there are no sessions, show an empty state
  if (projects.length === 0) {
    return (
      <div className="border-border bg-muted flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <FileCode className="text-muted-foreground mb-4 size-12" />
        <p className="mb-2 text-lg font-medium">No projects yet</p>
        <p className="text-muted-foreground text-sm">
          Start your first project by clicking the "Create New Project" button
          above.
        </p>
      </div>
    )
  }

  const handleRename = async (projectId: string) => {
    if (!editName.trim()) return

    const res = await updateProjectAction(projectId, {
      name: editName.trim()
    })
    if (res.isSuccess) {
      setEditingId(null)
      setEditName("")
      router.refresh()
    }
  }

  const handleDelete = async (projectId: string) => {
    const res = await deleteProjectAction(projectId)
    if (res.isSuccess) {
      setIsDeleting(null)
      router.refresh()
    }
  }

  // Otherwise, list all sessions in a grid
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <div
          key={project.id}
          className="bg-card hover:border-accent group relative flex flex-col overflow-hidden rounded-lg border transition-all hover:shadow-md"
        >
          {/* Session header with name and actions */}
          <div className="border-border flex items-center justify-between border-b p-4">
            {editingId === project.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Project name"
                  className="h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => handleRename(project.id)}
                >
                  <Check className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    setEditingId(null)
                    setEditName("")
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <FileCode className="size-5 text-blue-500" />
                  <span className="font-medium">
                    {project.name || `Project ${project.id.slice(0, 8)}...`}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingId(project.id)
                        setEditName(project.name || "")
                      }}
                    >
                      <Pencil className="mr-2 size-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setIsDeleting(project.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Session body - clickable area */}
          <Link
            href={`/project/${project.id}`}
            className="hover:bg-accent/10 flex flex-1 flex-col justify-between p-4"
          >
            {/* Session description - could be the idea or a truncated spec */}
            <div className="text-muted-foreground mb-4 text-sm">
              {project.projectShortSummary ?? "No description available"}
            </div>

            {/* Session metadata */}
            <div className="text-muted-foreground mt-auto space-y-2 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>
                  {project.createdAt
                    ? formatDistanceToNow(new Date(project.createdAt), {
                        addSuffix: true
                      })
                    : "Unknown date"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                {project.spec ? (
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    Complete
                  </span>
                ) : (
                  <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Delete confirmation overlay */}
          {isDeleting === project.id && (
            <div className="bg-background/95 absolute inset-0 flex flex-col items-center justify-center p-4">
              <p className="mb-4 text-center text-sm">
                Are you sure you want to delete this session?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleting(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

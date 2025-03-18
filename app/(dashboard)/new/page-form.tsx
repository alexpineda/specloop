"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/hooks/use-toast"
import {
  createNewProjectWithIdeaAction
  // createNewProjectFromExistingSpec
} from "@/actions/db/projects-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NewProjectFormProps {
  userId: string
}

export default function NewProjectForm({ userId }: NewProjectFormProps) {
  const [idea, setIdea] = useState<string>("")
  const [spec, setSpec] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSpecLoading, setIsSpecLoading] = useState<boolean>(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!idea.trim()) {
      toast({
        title: "Idea Required",
        description: "Please enter at least a short description of your idea.",
        variant: "destructive"
      })
      return
    }

    try {
      console.log("Creating new project with idea:", idea)
      setIsLoading(true)

      const res = await createNewProjectWithIdeaAction(idea)
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      // On success, we have the new session ID in res.data
      router.push(`/project/${res.data}/idea_chat`)
    } catch (error: any) {
      toast({
        title: "Error Creating Project",
        description: error.message || "Failed to create a new project",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSpecSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!spec.trim()) {
      toast({
        title: "Specification Required",
        description: "Please enter a technical specification.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSpecLoading(true)

      // TODO: Reimplement
      // const res = await createNewProjectFromExistingSpec(spec)
      // if (!res.isSuccess) {
      //   throw new Error(res.message)
      // }

      // On success, we have the new session ID in res.data
      // Since we already have a spec, we can skip to the plan stage
      // router.push(`/project/${res.data}/plan`)
    } catch (error: any) {
      toast({
        title: "Error Creating Project",
        description:
          error.message || "Failed to create a new project from spec",
        variant: "destructive"
      })
    } finally {
      setIsSpecLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Start a New Project
        </h1>

        <Tabs defaultValue="idea" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="idea">Start with an Idea</TabsTrigger>
            {/* TODO: Reimplement */}
            {/* <TabsTrigger value="spec">Start with a Spec</TabsTrigger> */}
          </TabsList>

          <TabsContent value="idea" className="mt-4">
            <p className="text-muted-foreground mb-4 text-center text-sm">
              Let us know what you have in mind. Enter a big idea, concept, or
              even a rough pitch for your web app. Our AI will help clarify the
              details in the next steps.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="idea" className="block text-sm font-medium">
                Describe your big idea:
              </label>
              <Textarea
                id="idea"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="I want to build an AI-powered note-taking app that organizes my notes automatically..."
                className="min-h-[200px]"
                disabled={isLoading}
              />

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2 text-base"
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="spec" className="mt-4">
            <p className="text-muted-foreground mb-4 text-center text-sm">
              Already have a technical specification? Paste it here to skip the
              ideation phase and go straight to implementation planning.
            </p>

            <form onSubmit={handleSpecSubmit} className="space-y-4">
              <label htmlFor="spec" className="block text-sm font-medium">
                Enter your technical specification:
              </label>
              <Textarea
                id="spec"
                value={spec}
                onChange={e => setSpec(e.target.value)}
                placeholder="# Project Technical Specification..."
                className="min-h-[300px] font-mono text-sm"
                disabled={isSpecLoading}
              />

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSpecLoading}
                  className="px-8 py-2 text-base"
                >
                  {isSpecLoading ? "Creating..." : "Create From Spec"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

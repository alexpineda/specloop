/*
<ai_context>
Skeleton loading component for the LLM configuration page.
</ai_context>
<recent_changes>
Created a skeleton loading component for the LLM configuration page.
</recent_changes>
*/

"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function LlmConfigSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">OpenAI API Key</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Model Selection</h3>
          <Skeleton className="h-4 w-full" />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-40" />
      </CardFooter>
    </Card>
  )
}

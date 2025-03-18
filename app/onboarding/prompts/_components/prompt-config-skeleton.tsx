/*
<ai_context>
Loading skeleton for the prompt configuration page.
</ai_context>
<recent_changes>
Created a skeleton loading component for the prompt configuration page.
</recent_changes>
*/

"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PromptConfigSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="project_request">
          <TabsList className="mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-sm" />
            ))}
          </TabsList>

          <TabsContent value="project_request">
            <Skeleton className="h-[400px] w-full" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

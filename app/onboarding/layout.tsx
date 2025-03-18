/*
<ai_context>
Layout for the onboarding section with navigation.
</ai_context>
<recent_changes>
Created a layout for the onboarding section with navigation.
</recent_changes>
*/

"use server"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function OnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
        <div>
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <h2 className="mb-4 text-lg font-semibold">Onboarding</h2>
                <div className="space-y-1">
                  <Link
                    href="/onboarding"
                    className="hover:bg-muted block rounded-md px-3 py-2 transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/onboarding/prompts"
                    className="hover:bg-muted block rounded-md px-3 py-2 transition-colors"
                  >
                    1. Prompt Configuration
                  </Link>
                  <Link
                    href="/onboarding/llm"
                    className="hover:bg-muted block rounded-md px-3 py-2 transition-colors"
                  >
                    2. LLM Configuration
                  </Link>
                  <Link
                    href="/"
                    className="hover:bg-muted block rounded-md px-3 py-2 transition-colors"
                  >
                    3. Start Building
                  </Link>
                </div>
              </nav>
            </CardContent>
          </Card>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

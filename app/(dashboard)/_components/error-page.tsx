/*
<ai_context>
A reusable error page component for the dashboard layout.
</ai_context>
<recent_changes>
Created a new error page component with a clean UI, helpful error message, and action buttons.
</recent_changes>
*/

"use client"

import React from "react"
import { AlertCircle, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

interface ErrorPageProps {
  error: Error | string
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const errorMessage = error instanceof Error ? error.message : error.toString()
  const isDatabaseError =
    errorMessage.includes("db:migrate") || errorMessage.includes("database")

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-destructive size-5" />
              <CardTitle className="text-xl font-semibold">
                Something went wrong
              </CardTitle>
            </div>
            <CardDescription>
              We encountered an error while loading the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/10"
            >
              <AlertCircle className="size-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-xs">
                {errorMessage}
              </AlertDescription>
            </Alert>

            {isDatabaseError && (
              <div className="bg-muted rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Terminal className="text-muted-foreground size-4" />
                  <p className="text-sm font-medium">
                    Try running this command:
                  </p>
                </div>
                <pre className="bg-background mt-2 overflow-x-auto rounded p-2 text-xs">
                  npm run db:migrate
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </Button>
            {reset && (
              <Button onClick={reset} className="gap-1">
                <RefreshCw className="mr-1 size-4" />
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

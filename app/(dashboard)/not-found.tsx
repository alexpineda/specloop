/*
<ai_context>
Not-found page for the dashboard to handle 404 errors.
</ai_context>
<recent_changes>
Created a not-found page with a clean UI and helpful message.
</recent_changes>
*/

"use client"

import React from "react"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <FileQuestion className="text-primary size-5" />
              <CardTitle className="text-xl font-semibold">
                Page Not Found
              </CardTitle>
            </div>
            <CardDescription>
              We couldn't find the page you were looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="text-center">
              <p className="text-primary/30 text-8xl font-bold">404</p>
              <p className="text-muted-foreground mt-4">
                The page you requested doesn't exist or has been moved
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

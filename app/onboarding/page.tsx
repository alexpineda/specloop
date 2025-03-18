/**
 * @file page.tsx
 * @description
 * This server component is the main homepage for SpecLoop.
 * It provides a friendly explanation of how the app works and encourages visitors to get started.
 *
 * @dependencies
 * - Various UI components for layout and styling
 */

"use server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default async function OnboardingPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Image
          src="/icons/favicon.svg"
          alt="SpecLoop Logo"
          width={40}
          height={40}
          className="size-10"
        />
        <h1 className="text-3xl font-bold">Welcome to SpecLoop</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Complete the following steps to get started with SpecLoop.
      </p>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Configure Prompts</CardTitle>
            <CardDescription>
              Set up the prompts used for generating content throughout the
              application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Customize the prompts used for project requests, specifications,
              implementation plans, and code generation to match your specific
              needs and preferences.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/onboarding/prompts">
              <Button>Configure Prompts</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Configure LLM</CardTitle>
            <CardDescription>
              Set up your OpenAI API key and model preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Configure your OpenAI API key and select which models to use for
              different tasks based on your requirements for speed, quality, and
              cost.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/onboarding/llm">
              <Button>Configure LLM</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Start Building</CardTitle>
            <CardDescription>
              Create your first project and start building.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Once you've configured your prompts, you can create your first
              project and start building your application.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Start Building</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

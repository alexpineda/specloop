/**
 * @file hero.tsx
 * @description
 * This client component provides the hero section on the landing page for SpecLoop.
 *
 * Key features:
 * - Showcases product name and tagline
 * - Provides a CTA button linking to the GitHub repo or sign-up flow
 * - Animations using Framer Motion
 *
 * @dependencies
 * - Button from "@/components/ui/button"
 * - motion from "framer-motion"
 * - Link from "next/link"
 * - Custom AnimatedGradientText and HeroVideoDialog for styling and demonstration
 *
 * @notes
 * - Updated to reflect "SpecLoop" brand identity and core messaging
 */

"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRight, Rocket } from "lucide-react"
import Link from "next/link"
import AnimatedGradientText from "../magicui/animated-gradient-text"
import HeroVideoDialog from "../magicui/hero-video-dialog"

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center"
      >
        <Link href="https://github.com/mckaywrigley/o1-pro-template-system">
          <AnimatedGradientText>
            🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
            <span
              className={cn(
                `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              View the code on GitHub
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-8 flex max-w-2xl flex-col items-center justify-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-balance text-6xl font-bold"
        >
          SpecLoop
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="max-w-xl text-balance text-xl"
        >
          Collaboratively refine your web app ideas with AI-guided prompts and
          generate full technical specs in minutes.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <Link href="https://github.com/mckaywrigley/o1-pro-template-system">
            <Button className="bg-blue-500 text-lg hover:bg-blue-600">
              <Rocket className="mr-2 size-5" />
              Get Started &rarr;
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        className="mx-auto mt-20 flex w-full max-w-screen-lg items-center justify-center rounded-lg border shadow-lg"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/9yS0dR0kP-s"
          thumbnailSrc="hero.png"
          thumbnailAlt="SpecLoop Hero Video"
        />
      </motion.div>
    </div>
  )
}

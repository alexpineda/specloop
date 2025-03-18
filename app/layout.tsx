/*
<ai_context>
Root layout component that sets up the basic HTML structure and global providers.
</ai_context>
<recent_changes>
Moved themeColor and viewport from metadata to generateViewport export to fix Next.js warnings.
</recent_changes>
*/

import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SpecLoop",
  description:
    "An AI-based platform to refine your web app ideas into robust technical specs.",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/favicon.svg",
        color: "#4F46E5"
      }
    ]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SpecLoop"
  }
}

export const generateViewport = (): Viewport => {
  return {
    themeColor: "#4F46E5",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
          inter.className
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}

          <TailwindIndicator />

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

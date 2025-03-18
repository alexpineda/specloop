/*
This server component provides the footer for the app.
*/

import { Github, Twitter } from "lucide-react"
import Link from "next/link"

export async function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Careers
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Product</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/features"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Documentation
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/support"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Support
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Privacy
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Social</h3>
            <div className="flex gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="text-muted-foreground hover:text-foreground size-6 transition" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="text-muted-foreground hover:text-foreground size-6 transition" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

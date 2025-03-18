/**
 * @file spec-viewer.tsx
 * @description
 * A client component for displaying a generated technical specification to the user.
 *
 * Key features:
 * - Accepts a specContent prop with the final specification in Markdown or text
 * - Renders it read-only
 * - Could parse or highlight the Markdown if needed
 *
 * @dependencies
 * - React, for client component rendering
 *
 * @notes
 * - If you want fancy markdown rendering, install a library like 'react-markdown'
 *   or something similar. For now, we show it in a pre block.
 * - This is a one-off component for the Specloop route, so we keep it in _components
 */

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface SpecViewerProps {
  /**
   * The generated technical specification content (e.g. in Markdown).
   */
  specContent: string
}

/**
 * SpecViewer
 * ----------
 * Displays the final generated specification to the user.
 */
export default function SpecViewer({ specContent }: SpecViewerProps) {
  // If you want to do fancy Markdown, you can do so here. For now, let's just show it in a pre.

  const [showCopied, setShowCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(specContent)
    setShowCopied(true)
    setTimeout(() => {
      setShowCopied(false)
    }, 2000)
  }

  return (
    <div className="mt-4 w-full rounded border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Specification</h2>
        <Button variant="outline" onClick={handleCopy}>
          {showCopied ? "Copied!" : "Copy Spec"}
        </Button>
      </div>
      <pre className="max-h-[400px] w-full overflow-auto text-sm">
        {specContent}
      </pre>
    </div>
  )
}

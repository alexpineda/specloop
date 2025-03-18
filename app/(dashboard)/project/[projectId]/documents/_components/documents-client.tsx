"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateAdditionalDocumentsAction } from "@/actions/db/projects-actions"
import { toast } from "sonner"

interface DocumentsClientProps {
  projectId: string
  initialDocuments: string
}

export default function DocumentsClient({
  projectId,
  initialDocuments
}: DocumentsClientProps) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const result = await updateAdditionalDocumentsAction(projectId, documents)

      if (result.isSuccess) {
        toast.success("Documents saved successfully")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to save documents")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        placeholder="Paste your additional documents here..."
        value={documents}
        onChange={e => setDocuments(e.target.value)}
        className="min-h-[400px]"
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Documents"}
        </Button>
      </div>
    </div>
  )
}

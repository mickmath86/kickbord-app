"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CampaignWizard } from "@/components/campaign-wizard"

interface CampaignWizardTriggerProps {
  children: React.ReactNode
}

export function CampaignWizardTrigger({ children }: CampaignWizardTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <CampaignWizard onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

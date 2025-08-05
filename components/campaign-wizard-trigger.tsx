"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CampaignWizardTriggerProps {
  children?: React.ReactNode
}

export function CampaignWizardTrigger({ children }: CampaignWizardTriggerProps) {
  const router = useRouter()

  const handleCreateCampaign = () => {
    router.push("/dashboard/campaigns/create")
  }

  return (
    <Button onClick={handleCreateCampaign} className="bg-blue-600 hover:bg-blue-700">
      {children || (
        <>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </>
      )}
    </Button>
  )
}

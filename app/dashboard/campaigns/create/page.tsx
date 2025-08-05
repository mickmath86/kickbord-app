"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CampaignWizardTrigger } from "@/components/campaign-wizard-trigger"

export default function CreateCampaignPage() {
  const router = useRouter()

  // Auto-trigger the wizard when this page loads
  useEffect(() => {
    // We'll use a state to auto-open the wizard
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CampaignWizardTrigger>
        <div className="hidden">Auto-trigger</div>
      </CampaignWizardTrigger>
    </div>
  )
}

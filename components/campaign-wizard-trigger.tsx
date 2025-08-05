"use client"

import type React from "react"

import { useRouter } from "next/navigation"

interface CampaignWizardTriggerProps {
  children: React.ReactNode
}

export function CampaignWizardTrigger({ children }: CampaignWizardTriggerProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push("/dashboard/campaigns/create")
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  )
}

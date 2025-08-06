"use client"

import { createContext, useContext } from "react"
import type { CampaignData } from "./page"

export const CampaignContext = createContext<{
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
} | null>(null)

export const useCampaignData = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error("useCampaignData must be used within a CampaignContext.Provider")
  }
  return context
}

"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface CampaignData {
  // Property Information
  property_type: string
  address: string
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  lot_size: string
  year_built: number | null
  key_features: string[]
  keywords: string[]
  additional_notes: string

  // Media
  photos: string[]
  videos: string[]

  // Ad Preferences
  materials_to_generate: string[]
  creative_style: string
  save_style: boolean
  copy_tone: string[]
  save_tone_default: boolean
  listing_style: string[]
  keywords_to_include: string

  // Generated Content
  generated_copy: any
  selected_copy: any
  feedback: any
}

const initialData: CampaignData = {
  property_type: "",
  address: "",
  price: null,
  bedrooms: null,
  bathrooms: null,
  square_feet: null,
  lot_size: "",
  year_built: null,
  key_features: [],
  keywords: [],
  additional_notes: "",
  photos: [],
  videos: [],
  materials_to_generate: [],
  creative_style: "",
  save_style: false,
  copy_tone: [],
  save_tone_default: false,
  listing_style: [],
  keywords_to_include: "",
  generated_copy: null,
  selected_copy: {},
  feedback: {},
}

const CampaignContext = createContext<{
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
} | null>(null)

export const useCampaignData = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error("useCampaignData must be used within CampaignProvider")
  }
  return context
}

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaignData, setCampaignData] = useState<CampaignData>(initialData)

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <CampaignContext.Provider value={{ data: campaignData, updateData: updateCampaignData }}>
      {children}
    </CampaignContext.Provider>
  )
}

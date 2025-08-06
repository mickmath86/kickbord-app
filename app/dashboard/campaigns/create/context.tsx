"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export interface CampaignData {
  // Onboarding
  agent_name?: string
  agent_email?: string
  agent_phone?: string
  brokerage?: string
  
  // Property Address
  address?: string
  city?: string
  state?: string
  zip_code?: string
  
  // Property Basics
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  lot_size?: string
  year_built?: number
  price?: number
  
  // Property Details
  key_features?: string[]
  property_condition?: string
  recent_updates?: string[]
  neighborhood_highlights?: string[]
  
  // Media Upload
  photos?: File[]
  virtual_tour_url?: string
  video_url?: string
  
  // Ad Preferences
  target_audience?: string[]
  marketing_tone?: string
  budget_range?: string
  materials_to_generate?: string[]
  
  // Generated Content
  generated_copy?: {
    social_posts?: string[]
    property_description?: string
    email_subject?: string
    email_body?: string
    landing_page_headline?: string
    landing_page_subheading?: string
  }
}

interface CampaignContextType {
  data: CampaignData
  updateData: (newData: Partial<CampaignData>) => void
  resetData: () => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CampaignData>({})

  const updateData = (newData: Partial<CampaignData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  const resetData = () => {
    setData({})
  }

  return (
    <CampaignContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaignData() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaignData must be used within a CampaignProvider')
  }
  return context
}

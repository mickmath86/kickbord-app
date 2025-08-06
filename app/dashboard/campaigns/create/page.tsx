"use client"

import { useState } from "react"
import { CampaignWizard } from "@/components/campaign-wizard"
import { CampaignProvider } from "./context"

export default function CreateCampaignPage() {
  return (
    <CampaignProvider>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground mt-2">
              Let's create a comprehensive marketing campaign for your property listing.
            </p>
          </div>
          <CampaignWizard />
        </div>
      </div>
    </CampaignProvider>
  )
}

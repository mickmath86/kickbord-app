import React from 'react'
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Users, DollarSign, Eye } from "lucide-react"
import Link from "next/link"

async function getTableData(){
    const supabase = await createClient()

    try {
        const {data: tableData } = await supabase.from("campaigns").select("*")
        return {
            tableData: tableData,
        }  
    } catch (error){
        console.error("Error fetching campaign stats:", error)
    }
   
}
export default async function TestPage() {
  
    const [items] = await Promise.all([getTableData()])
  return (
    <div className="p-6 grid grid-cols-3 gap-6 items-center justify-between">
       {items?.tableData?.map((item)=>(
        <Card key={item.id}>{item.property_address}</Card>
       ))}
        
      
    </div>
  )
}

// async function getTableData() {
//     const supabase = await createClient()

//     try {
//         const {data: tableData} = await supabase.from("campaigns").select("*")

//         return {
//             tableData: tableData
//         }
//     } catch(error){
//         console.log("Error collecting Data", error)
//     }
// }

// export default async function TestPage() {
//     const [items] = await Promise.all([getTableData()])

//     return (
//         <div className="p-6">
//             {items?.tableData?.map((item)=>
//                 <Card>{item.id}</Card>
//             )}
//         </div>
//     )
// }

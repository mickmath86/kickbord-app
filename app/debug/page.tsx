import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DebugPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Get all profiles
  const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(10)

  // Get auth users count (if accessible)
  const { count: authUsersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug Information</h1>

        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Information about the currently logged in user</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ user, userError }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profiles Table</CardTitle>
            <CardDescription>Current data in the profiles table</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Total profiles: {authUsersCount || 0}</p>
            <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ profiles, profilesError }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

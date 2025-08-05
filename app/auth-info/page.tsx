import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AuthInfoPage() {
  const supabase = await createClient()

  // Get current authenticated user (this is how we access auth.users data)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Get session information
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  // Try to get profile from our custom table
  const { data: profile, error: profileError } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null, error: null }

  // Try to count total profiles (this we can see)
  const { count: profileCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Authentication Information</h1>
          <Badge variant={user ? "default" : "secondary"}>{user ? "Authenticated" : "Not Authenticated"}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How Supabase Auth Works</CardTitle>
            <CardDescription>Understanding the authentication system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🔐 Authentication Schema (auth.*)</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <code>auth.users</code> - Hidden system table managed by Supabase
                </li>
                <li>• Contains email, password hash, metadata, confirmation status</li>
                <li>• Not directly accessible via SQL Editor (security feature)</li>
                <li>
                  • Accessed via <code>supabase.auth.getUser()</code> in code
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📊 Public Schema (public.*)</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  • <code>public.profiles</code> - Our custom user data table
                </li>
                <li>• Visible in Supabase dashboard</li>
                <li>• Contains additional user information</li>
                <li>• References auth.users via foreign key</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current User Data</CardTitle>
            <CardDescription>Data from Supabase Auth system (auth.users)</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Confirmed</p>
                    <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                      {user.email_confirmed_at ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p>{new Date(user.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">User Metadata</p>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                      {JSON.stringify(user.user_metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {session && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Session Info</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Access Token Expires</p>
                        <p>{new Date(session.expires_at! * 1000).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Refresh Token</p>
                        <p className="font-mono text-xs">{session.refresh_token?.substring(0, 20)}...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Not authenticated</p>
                <p className="text-sm text-gray-400 mt-2">Please sign in to see user data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Data</CardTitle>
            <CardDescription>Data from our custom profiles table (public.profiles)</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Profile ID</p>
                    <p className="font-mono text-sm">{profile.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p>{profile.full_name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p>{profile.first_name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p>{profile.last_name || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Profile Created</p>
                    <p>{new Date(profile.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p>{new Date(profile.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : profileError ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">No Profile Found</p>
                <p className="text-yellow-700 text-sm mt-1">Error: {profileError.message}</p>
                <p className="text-yellow-600 text-sm mt-2">
                  This is normal if you just signed up. The profile will be created when you visit the dashboard.
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No user to check profile for</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
            <CardDescription>What we can see in our database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Total Profiles</p>
                <p className="text-2xl font-bold">{profileCount || 0}</p>
                <p className="text-xs text-gray-400">In public.profiles table</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Auth Users</p>
                <p className="text-2xl font-bold">Hidden</p>
                <p className="text-xs text-gray-400">In auth.users (not visible)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuthTestPage() {
  const supabase = await createClient()

  // Get current authenticated user from auth.users
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Try to get profile from our custom profiles table
  const { data: profile, error: profileError } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null, error: null }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Test</h1>

        <Card>
          <CardHeader>
            <CardTitle>Auth User (from auth.users)</CardTitle>
            <CardDescription>This data comes from Supabase's authentication system</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Email Confirmed:</strong> {user.email_confirmed_at ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Metadata:</strong>
                </p>
                <pre className="bg-slate-100 p-2 rounded text-sm">{JSON.stringify(user.user_metadata, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-red-600">Not authenticated - please sign in</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Data (from profiles table)</CardTitle>
            <CardDescription>This data comes from our custom profiles table</CardDescription>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-2">
                <p>
                  <strong>Profile ID:</strong> {profile.id}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Name:</strong> {profile.full_name}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}
                </p>
              </div>
            ) : profileError ? (
              <div className="text-amber-600">
                <p>
                  <strong>Profile not found:</strong> {profileError.message}
                </p>
                <p className="text-sm mt-2">
                  This is normal! The user is authenticated via auth.users, but no profile record exists yet. The
                  profile will be created when they visit the dashboard.
                </p>
              </div>
            ) : (
              <p>No user to check profile for</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Authentication</strong> uses only the <code>auth.users</code> table
              </li>
              <li>
                <strong>Sign in</strong> works even without a profiles record
              </li>
              <li>
                <strong>Profiles table</strong> is just for additional app data
              </li>
              <li>
                <strong>User metadata</strong> (first_name, last_name) is stored in auth.users
              </li>
              <li>
                <strong>Profile creation</strong> happens on first dashboard visit
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

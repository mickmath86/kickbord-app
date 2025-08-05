import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Your App</CardTitle>
          <CardDescription>Get started by signing in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/login?tab=signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

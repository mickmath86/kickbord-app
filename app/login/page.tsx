"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { signUp, signIn } from "@/app/auth/actions"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  // Check URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const tab = urlParams.get("tab")
      setIsSignUp(tab === "signup")
    }
  }, [])

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await signUp(formData)

      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.message) {
        setMessage({ type: "success", text: result.message })
      } else if (result?.success) {
        setMessage({ type: "success", text: "Account created successfully!" })
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await signIn(formData)

      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      }
    } catch (error) {
      console.error("Signin error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex flex-col gap-6 md:w-1/2">
            <Link
              href="/"
              className="flex items-center gap-2 self-start font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              Your App
            </Link>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold md:text-3xl">{isSignUp ? "Create your account" : "Welcome back"}</h1>
                <p className="text-balance text-muted-foreground">
                  {isSignUp
                    ? "Enter your information to create an account"
                    : "Enter your email and password to sign in to your account"}
                </p>
              </div>

              {message && (
                <Alert
                  className={`${
                    message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <form action={isSignUp ? handleSignUp : handleSignIn} className="flex flex-col gap-6">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        disabled={isLoading}
                        minLength={1}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        disabled={isLoading}
                        minLength={1}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                      required
                      disabled={isLoading}
                      minLength={isSignUp ? 6 : 1}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? isSignUp
                      ? "Creating account..."
                      : "Signing in..."
                    : isSignUp
                      ? "Create account"
                      : "Sign in"}
                </Button>
              </form>

              <div className="text-center text-sm">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setMessage(null)
                  }}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted md:block md:w-1/2">
            <img
              src="/login-logo.png"
              alt="Welcome illustration"
              className="absolute rounded-md inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

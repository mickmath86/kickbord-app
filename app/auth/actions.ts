"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Sign up the user with metadata
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) {
    console.error("Signup error:", error)
    return { error: error.message }
  }

  if (!authData.user) {
    return { error: "Failed to create user" }
  }

  console.log("User created successfully:", authData.user.id)

  // Wait a moment for the trigger to potentially fire
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if profile was created by trigger
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single()

  if (profileError && profileError.code === "PGRST116") {
    // Profile doesn't exist, the trigger didn't work
    console.log("Profile not found, trigger may not have fired. This is expected behavior.")
    console.log("The profile will be created when the user first accesses the dashboard.")
  } else if (profile) {
    console.log("Profile created successfully by trigger:", profile)
  } else {
    console.log("Profile check error:", profileError)
  }

  revalidatePath("/", "layout")

  // Check if email confirmation is required
  if (authData.user && !authData.session) {
    return {
      success: true,
      message: "Please check your email to confirm your account before signing in!",
    }
  }

  // If user is immediately signed in, redirect to dashboard
  redirect("/dashboard")
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error)
    return { error: error.message }
  }

  if (!data.user) {
    return { error: "Sign in failed" }
  }

  console.log("User signed in successfully:", data.user.id)

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign out error:", error)
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get the user's profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    ...user,
    profile,
  }
}

export async function ensureProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Not authenticated" }
  }

  // Check if profile exists
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (existingProfile) {
    return { profile: existingProfile }
  }

  if (profileError && profileError.code === "PGRST116") {
    // Profile doesn't exist, create it
    const profileData = {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      full_name:
        `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
        user.email?.split("@")[0] ||
        "User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert(profileData)
      .select()
      .single()

    if (createError) {
      console.error("Profile creation error:", createError)
      return { error: `Failed to create profile: ${createError.message}` }
    }

    return { profile: newProfile }
  }

  return { error: "Failed to fetch profile" }
}

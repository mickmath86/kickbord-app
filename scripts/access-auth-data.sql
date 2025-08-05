-- These are the ways to access auth data in Supabase:

-- 1. Check current authenticated user (works in RLS context)
SELECT 
  'current_user_id' as info_type,
  auth.uid() as user_id;

-- 2. Get JWT claims (works in RLS context)  
SELECT 
  'jwt_claims' as info_type,
  auth.jwt() as jwt_data;

-- 3. Check if we can see auth schema (usually restricted)
SELECT 
  'auth_schema_tables' as info_type,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 4. What we CAN see - our profiles table
SELECT 
  'profiles_data' as info_type,
  COUNT(*) as total_profiles,
  MIN(created_at) as first_profile,
  MAX(created_at) as latest_profile
FROM public.profiles;

-- 5. Show relationship between what we know
SELECT 
  'profile_sample' as info_type,
  id,
  email,
  full_name,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 3;

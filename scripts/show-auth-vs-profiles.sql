-- Show users in auth.users table (authentication data)
SELECT 
  'auth_users' as table_name,
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Show users in profiles table (our custom data)
SELECT 
  'profiles' as table_name,
  id,
  email,
  first_name,
  last_name,
  full_name,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- Show the relationship - users who have auth but no profile yet
SELECT 
  'users_without_profiles' as check_type,
  au.id,
  au.email,
  au.created_at as auth_created,
  CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 10;

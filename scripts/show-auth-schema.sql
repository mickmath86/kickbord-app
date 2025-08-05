-- Show all schemas in the database
SELECT schema_name 
FROM information_schema.schemata 
ORDER BY schema_name;

-- Show tables in the auth schema (if accessible)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- Try to access auth.users (may require special permissions)
SELECT 
  'auth_users_accessible' as check_type,
  COUNT(*) as total_users
FROM auth.users;

-- Show current user from the auth perspective
SELECT 
  'current_auth_user' as check_type,
  auth.uid() as current_user_id,
  auth.jwt() as current_jwt;

-- Alternative: Show users through the admin API (if available)
-- This might not work depending on your RLS settings
SELECT 
  'users_via_admin' as check_type,
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users
LIMIT 5;

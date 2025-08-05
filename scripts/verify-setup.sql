-- Check if profiles table exists and show its structure
SELECT 
  'profiles_table' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
  'rls_status' as check_type,
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Check policies
SELECT 
  'policies' as check_type,
  policyname,
  cmd as command,
  permissive
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Check if trigger exists
SELECT 
  'trigger' as check_type,
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  'function' as check_type,
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

-- Show current data count
SELECT 'data_count' as check_type, COUNT(*) as total_profiles FROM public.profiles;

-- Check if profiles table exists and its structure
SELECT 
  'Table exists' as check_type,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN 'YES' ELSE 'NO' END as result;

-- Show all columns in profiles table
SELECT 
  'Column structure' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check current data in profiles table
SELECT 'Current data' as check_type, count(*) as total_rows FROM public.profiles;

-- Show actual profile records (limit 5)
SELECT 'Sample data' as check_type, * FROM public.profiles LIMIT 5;

-- Check if trigger exists
SELECT 
  'Trigger exists' as check_type,
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  'Function exists' as check_type,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' AND routine_schema = 'public';

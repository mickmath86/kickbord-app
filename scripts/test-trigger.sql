-- This script will help test if the trigger is working
-- First, let's see current auth users
SELECT 'current_auth_users' as check_type, COUNT(*) as total FROM auth.users;

-- Show current profiles
SELECT 'current_profiles' as check_type, COUNT(*) as total FROM public.profiles;

-- Show sample of existing data (if any)
SELECT 'sample_profiles' as check_type, id, email, first_name, last_name, full_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

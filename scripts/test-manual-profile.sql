-- Test manual profile creation
INSERT INTO public.profiles (id, email, name, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Check if it was inserted
SELECT * FROM public.profiles WHERE email = 'test@example.com';

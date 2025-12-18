-- ============================================================================
-- Update Existing Users: Sync roles from auth.users metadata to user_profiles
-- ============================================================================
-- Run this script if you have existing users and need to sync their roles
-- ============================================================================

-- Step 1: Create profiles for existing users who don't have one
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', ''),
    COALESCE(u.raw_user_meta_data->>'role', 'candidate')
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 2: Update existing profiles with roles from metadata
UPDATE public.user_profiles p
SET 
    role = COALESCE(
        (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = p.id),
        p.role
    ),
    full_name = COALESCE(
        (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = p.id),
        p.full_name
    ),
    updated_at = TIMEZONE('utc', NOW())
WHERE EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = p.id 
    AND u.raw_user_meta_data->>'role' IS NOT NULL
);

-- Step 3: Verify the sync
SELECT 
    p.email,
    p.role as profile_role,
    u.raw_user_meta_data->>'role' as metadata_role,
    CASE 
        WHEN p.role = COALESCE(u.raw_user_meta_data->>'role', 'candidate') 
        THEN '✓ Synced' 
        ELSE '✗ Mismatch' 
    END as status
FROM public.user_profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;


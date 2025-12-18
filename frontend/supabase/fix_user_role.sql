-- ============================================================================
-- Quick Fix: Set Role for Existing User
-- ============================================================================
-- Run this script to fix a specific user's role
-- Replace 'blackholeinfiverse64@gmail.com' with the user's email
-- Replace 'candidate' with the correct role (candidate, recruiter, or client)
-- ============================================================================

-- Option 1: If user_profiles table exists, update/create profile
-- First, check if profile exists
DO $$
DECLARE
    user_id_val UUID;
    user_email_val TEXT := 'blackholeinfiverse64@gmail.com';
    user_role_val TEXT := 'candidate'; -- Change to: 'candidate', 'recruiter', or 'client'
BEGIN
    -- Get user ID from auth.users
    SELECT id INTO user_id_val
    FROM auth.users
    WHERE email = user_email_val;
    
    IF user_id_val IS NULL THEN
        RAISE NOTICE 'User with email % not found', user_email_val;
        RETURN;
    END IF;
    
    -- Insert or update profile
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        user_id_val,
        user_email_val,
        COALESCE(
            (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = user_id_val),
            split_part(user_email_val, '@', 1)
        ),
        user_role_val
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = user_role_val,
        email = user_email_val,
        updated_at = TIMEZONE('utc', NOW());
    
    RAISE NOTICE 'Profile updated for user: % with role: %', user_email_val, user_role_val;
    
    -- Also update metadata
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('role', user_role_val)
    WHERE id = user_id_val;
    
    RAISE NOTICE 'Metadata updated for user: %', user_email_val;
END $$;

-- Option 2: Verify the fix
SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.role as profile_role,
    CASE 
        WHEN p.role IS NOT NULL THEN '✓ Profile exists'
        ELSE '✗ No profile'
    END as status
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'blackholeinfiverse64@gmail.com';

-- ============================================================================
-- For Recruiter Account (blackholeadmin321@gmail.com)
-- ============================================================================
-- Run this separately for the recruiter account:

DO $$
DECLARE
    user_id_val UUID;
    user_email_val TEXT := 'blackholeadmin321@gmail.com';
    user_role_val TEXT := 'recruiter';
BEGIN
    SELECT id INTO user_id_val
    FROM auth.users
    WHERE email = user_email_val;
    
    IF user_id_val IS NULL THEN
        RAISE NOTICE 'User with email % not found', user_email_val;
        RETURN;
    END IF;
    
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        user_id_val,
        user_email_val,
        COALESCE(
            (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = user_id_val),
            split_part(user_email_val, '@', 1)
        ),
        user_role_val
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = user_role_val,
        email = user_email_val,
        updated_at = TIMEZONE('utc', NOW());
    
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('role', user_role_val)
    WHERE id = user_id_val;
    
    RAISE NOTICE 'Profile updated for user: % with role: %', user_email_val, user_role_val;
END $$;


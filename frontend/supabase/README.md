# Supabase Schema Setup for Authentication

This directory contains Supabase migrations for setting up user authentication with role-based access control.

## 📋 Migration Files

### `001_create_user_profiles.sql`
Creates the `user_profiles` table that extends Supabase Auth with:
- User role (candidate, recruiter, client)
- Full name, phone, company
- Automatic profile creation on signup
- Row Level Security (RLS) policies

## 🚀 How to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `001_create_user_profiles.sql`
4. Paste and run the SQL in the editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Manual SQL Execution

1. Connect to your Supabase database
2. Run the SQL from `001_create_user_profiles.sql`
3. Verify the tables were created:
   ```sql
   SELECT * FROM public.user_profiles;
   ```

## 📊 Database Schema

### `user_profiles` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | References `auth.users.id` (Primary Key) |
| `email` | TEXT | User email (Unique) |
| `full_name` | TEXT | User's full name |
| `role` | TEXT | User role: 'candidate', 'recruiter', or 'client' |
| `phone` | TEXT | Phone number (optional) |
| `company` | TEXT | Company name (optional) |
| `avatar_url` | TEXT | Profile picture URL (optional) |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## 🔐 Security Features

1. **Row Level Security (RLS)**: Enabled on `user_profiles` table
2. **Policies**:
   - Users can only view/update their own profile
   - Service role has full access (for backend operations)
3. **Automatic Profile Creation**: Trigger creates profile on user signup

## 🔄 How It Works

1. **User Signup**:
   - User signs up via Supabase Auth
   - Trigger `on_auth_user_created` fires automatically
   - Profile is created in `user_profiles` with role from `user_metadata`

2. **User Login**:
   - Frontend can query role from:
     - `user_profiles.role` (via Supabase client)
     - `auth.users.raw_user_meta_data->>'role'` (from Auth metadata)

3. **Role Updates**:
   - Update `user_profiles.role` directly
   - Or use function: `SELECT update_user_role('user@example.com', 'recruiter')`

## 📝 Usage Examples

### Query User Role (Frontend)

```typescript
import { supabase } from './lib/supabase'

// Get current user's role
const { data, error } = await supabase
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .single()

const userRole = data?.role
```

### Update User Role (Backend/Admin)

```sql
-- Update user role
UPDATE public.user_profiles
SET role = 'recruiter'
WHERE email = 'user@example.com';

-- Or use the helper function
SELECT update_user_role('user@example.com', 'recruiter');
```

### Get All Users by Role

```sql
SELECT email, full_name, role, created_at
FROM public.user_profiles
WHERE role = 'recruiter'
ORDER BY created_at DESC;
```

## ⚠️ Important Notes

1. **Role Values**: Must be exactly one of: `'candidate'`, `'recruiter'`, `'client'`
2. **Email Uniqueness**: Each email can only have one profile
3. **Cascade Delete**: Deleting a user from `auth.users` automatically deletes their profile
4. **Metadata Sync**: The trigger syncs role from `user_metadata` to `user_profiles`

## 🔧 Troubleshooting

### Profile Not Created on Signup

1. Check if trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Check trigger function:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. Manually create profile if needed:
   ```sql
   INSERT INTO public.user_profiles (id, email, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'user@example.com'),
     'user@example.com',
     'candidate'
   );
   ```

### Role Not Updating

1. Check if user exists:
   ```sql
   SELECT * FROM public.user_profiles WHERE email = 'user@example.com';
   ```

2. Update manually:
   ```sql
   UPDATE public.user_profiles
   SET role = 'recruiter', updated_at = NOW()
   WHERE email = 'user@example.com';
   ```

## 📚 Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)


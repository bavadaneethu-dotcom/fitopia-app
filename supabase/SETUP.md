# Supabase Setup Guide for Fitopia

This guide will help you set up the complete Supabase backend for the Fitopia fitness app.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: fitopia-app (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (2-3 minutes)

## Step 2: Enable Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Toggle "Enable email provider" to ON
   - Configure email templates if needed (optional)
3. Save changes

## Step 3: Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Open the file `supabase/database.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Wait for all statements to execute successfully

**Expected output**: You should see "Success. No rows returned" for most statements, with some showing the created objects.

## Step 4: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `user_profiles`
   - `food_logs`
   - `activity_logs`
   - `water_logs`
   - `fasting_logs`

## Step 5: Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Or check each table in **Table Editor** → Select table → Click "Policies" tab
3. Verify RLS is enabled and policies are created for each table

## Step 6: Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click "New bucket"

### Create `food-evidence` bucket:
- **Name**: `food-evidence`
- **Public bucket**: ❌ (Unchecked - Private)
- **File size limit**: 10 MB (or as needed)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- Click "Create bucket"

3. Click "New bucket" again

### Create `avatar-lab` bucket:
- **Name**: `avatar-lab`
- **Public bucket**: ❌ (Unchecked - Private)
- **File size limit**: 10 MB (or as needed)
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`
- Click "Create bucket"

## Step 7: Configure Storage Policies

For each bucket (`food-evidence` and `avatar-lab`), set up policies:

1. Go to **Storage** → Select the bucket
2. Click "Policies" tab
3. Click "New Policy"
4. Create these policies for each bucket:

### Policy 1: Users can upload their own files
- **Policy name**: "Users can upload own files"
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

### Policy 2: Users can view their own files
- **Policy name**: "Users can view own files"
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

### Policy 3: Users can delete their own files
- **Policy name**: "Users can delete own files"
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

**Repeat these policies for `avatar-lab` bucket** (change bucket_id in the policy definition).

## Step 8: Get API Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values (you'll need them for your app):
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: (starts with `eyJ...`)
   - **service_role key**: (keep this secret! Only for server-side)

## Step 9: Test the Setup

You can test the database setup using the SQL Editor:

```sql
-- Test calorie calculation function
SELECT calculate_calorie_limit(68.0, 175.0, 26, 'female', 'Active', 'maintain');

-- Test BMR calculation
SELECT calculate_bmr(68.0, 175.0, 26, 'female');

-- Test TDEE calculation
SELECT calculate_tdee(68.0, 175.0, 26, 'female', 'Active');
```

## Step 10: Environment Variables

Add these to your app's environment variables (`.env` file or GitHub Secrets):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit the `service_role` key to your frontend code!

## Troubleshooting

### Issue: "permission denied for table user_profiles"
**Solution**: Make sure RLS policies are created and enabled. Check that you're authenticated.

### Issue: Storage upload fails
**Solution**: 
1. Verify bucket policies are set correctly
2. Check that file size is within limits
3. Ensure user is authenticated (has auth.uid())

### Issue: Triggers not firing
**Solution**: 
1. Check that triggers are created: Run `\d+ table_name` in SQL Editor
2. Verify functions exist: `SELECT * FROM pg_proc WHERE proname LIKE '%xp%';`

### Issue: XP not being added
**Solution**: 
1. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE '%xp%';`
2. Check user_profile exists for the user
3. Verify RLS allows the operation

## Next Steps

1. **Connect your frontend**: Use Supabase client libraries to connect your React app
2. **Implement Edge Functions**: Create Deno functions for AI processing (optional)
3. **Set up email templates**: Customize authentication emails
4. **Configure CORS**: Add your app domains to allowed origins

## Useful SQL Queries

### View all tables and their RLS status:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Check all triggers:
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### View user profile stats:
```sql
SELECT 
  id,
  name,
  current_level,
  current_xp,
  max_xp,
  streak_days,
  daily_calorie_limit
FROM user_profiles;
```

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in your repository


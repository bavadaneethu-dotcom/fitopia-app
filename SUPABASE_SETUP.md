# Supabase Backend Setup Guide

Complete guide to set up Supabase backend and integrate with your Fitopia app.

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `fitopia-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 2. Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Open `supabase/database.sql` from this project
4. Copy **entire contents** and paste into SQL Editor
5. Click **"Run"** (Cmd/Ctrl + Enter)
6. Wait for all statements to execute

**Verify**: Go to **Table Editor** - you should see 5 tables:
- `user_profiles`
- `food_logs`
- `activity_logs`
- `water_logs`
- `fasting_logs`

### 3. Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (toggle ON)
3. Optionally configure email templates

### 4. Create Storage Buckets

1. Go to **Storage**
2. Click **"New bucket"**

**Bucket 1: `food-evidence`**
- Name: `food-evidence`
- Public: ❌ (Unchecked)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

**Bucket 2: `avatar-lab`**
- Name: `avatar-lab`
- Public: ❌ (Unchecked)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### 5. Configure Storage Policies

For each bucket, go to **Policies** tab and create:

**Policy: Users can upload own files**
- Operation: INSERT
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

**Policy: Users can view own files**
- Operation: SELECT
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

**Policy: Users can delete own files**
- Operation: DELETE
```sql
(bucket_id = 'food-evidence'::text AND (storage.foldername(name))[1] = auth.uid()::text)
```

Repeat for `avatar-lab` bucket (change bucket_id in policies).

### 6. Get API Credentials

1. Go to **Project Settings** (⚙️) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (starts with eyJ)

### 7. Configure Frontend Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_BASE_PATH=/fitopia-app/
```

**For GitHub Pages deployment**, add these as **Repository Secrets**:
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key

Then update `.github/workflows/deploy.yml` build step:
```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_BASE_PATH: '/fitopia-app/'
  run: npm run build
```

## 📋 Verification Checklist

- [ ] Database tables created (5 tables visible)
- [ ] RLS policies enabled on all tables
- [ ] Authentication enabled (Email provider)
- [ ] Storage buckets created (`food-evidence`, `avatar-lab`)
- [ ] Storage policies configured
- [ ] API credentials copied
- [ ] Environment variables set
- [ ] Test query works in SQL Editor

## 🧪 Testing the Setup

Run this in Supabase SQL Editor to test:

```sql
-- Test calorie calculation
SELECT calculate_calorie_limit(68.0, 175.0, 26, 'female', 'Active', 'maintain');

-- Test BMR calculation
SELECT calculate_bmr(68.0, 175.0, 26, 'female');

-- View all tables
SELECT * FROM user_profiles LIMIT 1;
```

## 🔗 Integration with Frontend

The API functions are already created in:
- `lib/supabase.ts` - Supabase client
- `lib/api/*.ts` - API service functions

**Next steps**:
1. Install dependencies: `npm install`
2. Set environment variables
3. Update `App.tsx` to use Supabase APIs instead of local state
4. Test authentication flow

## 📚 API Functions Available

### Authentication (`lib/api/auth.ts`)
- `signUp()` - Create new user account
- `signIn()` - Sign in existing user
- `signOut()` - Sign out
- `getCurrentUser()` - Get current user
- `resetPassword()` - Reset password

### Profile (`lib/api/profile.ts`)
- `getUserProfile()` - Get user profile
- `upsertUserProfile()` - Create/update profile
- `updateBiometrics()` - Update biometrics (triggers calorie recalculation)

### Food Logs (`lib/api/foodLogs.ts`)
- `getFoodLogs()` - Get food logs (with date filters)
- `addFoodLog()` - Add food log (+50 XP automatically)
- `updateFoodLog()` - Update food log
- `deleteFoodLog()` - Delete food log

### Activity Logs (`lib/api/activityLogs.ts`)
- `getActivityLogs()` - Get workouts/meditation logs
- `addActivityLog()` - Add activity (XP calculated automatically)
- `updateActivityLog()` - Update activity
- `deleteActivityLog()` - Delete activity

### Water Logs (`lib/api/waterLogs.ts`)
- `getWaterLogs()` - Get water logs
- `addWaterLog()` - Add water log (+10 XP automatically)
- `updateWaterLog()` - Update water log
- `deleteWaterLog()` - Delete water log

### Fasting Logs (`lib/api/fastingLogs.ts`)
- `getFastingLogs()` - Get fasting history
- `startFasting()` - Start fasting session
- `endFasting()` - End fasting session
- `getActiveFasting()` - Get active fasting session

## 🛠️ Troubleshooting

### Issue: "permission denied for table"
**Solution**: Check RLS policies are enabled and user is authenticated

### Issue: Service worker registration fails
**Solution**: Verify service worker path includes base path

### Issue: Authentication not working
**Solution**: 
- Check email provider is enabled
- Verify environment variables are set correctly
- Check browser console for errors

### Issue: XP not updating
**Solution**: 
- Verify triggers are created: `SELECT * FROM pg_trigger WHERE tgname LIKE '%xp%';`
- Check user_profile exists for the user

## 📖 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- See `supabase/SETUP.md` for detailed setup instructions

## 🔐 Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Never expose `service_role` key in frontend code
- Use `anon` key in frontend (RLS protects data)
- All API functions use RLS automatically (users can only access their own data)


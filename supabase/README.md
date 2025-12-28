# Supabase Backend Setup

Complete database and backend setup for Fitopia fitness app.

## Quick Start

1. **Follow the setup guide**: Open `SETUP.md` and follow step-by-step instructions
2. **Run the database schema**: Copy and paste `database.sql` into Supabase SQL Editor
3. **Configure storage**: Use `storage-setup.sql` after creating buckets via UI
4. **Reference API examples**: Use `api-examples.sql` for implementation reference

## Files Overview

### `database.sql`
Complete database schema including:
- ✅ All tables (user_profiles, food_logs, activity_logs, water_logs, fasting_logs)
- ✅ PostgreSQL functions for BMR, TDEE, calorie calculations
- ✅ XP and leveling system with automatic triggers
- ✅ Row Level Security (RLS) policies
- ✅ Automatic streak tracking
- ✅ Indexes for performance

### `SETUP.md`
Step-by-step guide covering:
- Project creation
- Authentication setup
- Database schema deployment
- Storage bucket configuration
- Policy setup
- Testing procedures

### `storage-setup.sql`
Storage bucket policies for:
- `food-evidence` bucket (private)
- `avatar-lab` bucket (private)
- User-specific folder structure

### `api-examples.sql`
Example SQL queries showing:
- How to implement each API endpoint
- Expected request/response patterns
- Date filtering examples
- Analytics queries

## Features Implemented

✅ **User Profiles**
- Biometric data storage
- Automatic calorie limit calculation (Mifflin-St Jeor equation)
- Gamification (XP, levels, streaks)
- Character selection and inventory

✅ **Food Logging**
- Calorie and macro tracking
- AI feedback support (when integrated)
- Image storage support
- Automatic +50 XP on log

✅ **Activity Logging**
- Workout tracking (10 XP/minute)
- Meditation tracking (5 XP/minute)
- Duration and calorie burn
- Category support

✅ **Water Logging**
- Daily hydration tracking
- Automatic +10 XP on log
- Date-based queries

✅ **Fasting Tracking**
- Protocol management
- Duration calculation
- Start/end time tracking

✅ **XP & Leveling System**
- Automatic XP calculation
- Level-up logic (50% max_xp increase)
- Streak tracking
- Real-time updates

✅ **Security**
- Row Level Security (RLS) enabled
- User-scoped data access
- Secure storage policies

## Next Steps

After running the database setup:

1. **Get API credentials** from Supabase Dashboard
2. **Install Supabase client** in your React app:
   ```bash
   npm install @supabase/supabase-js
   ```
3. **Connect your app** using the credentials
4. **Implement API endpoints** using examples from `api-examples.sql`
5. **Test authentication** flow
6. **Deploy Edge Functions** (optional, for AI features)

## Support

See `SETUP.md` for detailed instructions and troubleshooting.


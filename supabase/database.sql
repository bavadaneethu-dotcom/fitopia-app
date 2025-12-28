-- Fitopia Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  age INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(dob))) STORED,
  height_cm DECIMAL(5,2) NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  activity_level TEXT NOT NULL DEFAULT 'Active',
  unit_system TEXT NOT NULL DEFAULT 'metric' CHECK (unit_system IN ('metric', 'imperial')),
  daily_calorie_limit INTEGER NOT NULL DEFAULT 2000,
  user_goal TEXT NOT NULL DEFAULT 'maintain' CHECK (user_goal IN ('lose', 'maintain', 'gain')),
  active_character_id TEXT NOT NULL DEFAULT 'judy',
  current_level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  max_xp INTEGER NOT NULL DEFAULT 1000,
  inventory TEXT[] DEFAULT ARRAY['none']::TEXT[],
  equipped_accessory TEXT,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food Logs Table
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(6,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(6,2) NOT NULL DEFAULT 0,
  fat DECIMAL(6,2) NOT NULL DEFAULT 0,
  category TEXT,
  icon TEXT DEFAULT '🍽️',
  display_amount TEXT,
  ai_feedback TEXT,
  zpd_status TEXT,
  image_url TEXT,
  timestamp TIME NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_food_entry UNIQUE (user_id, name, log_date, timestamp)
);

-- Activity Logs Table (Workouts & Meditation)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('workout', 'meditation')),
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  duration_text TEXT NOT NULL,
  calories_burned INTEGER,
  color TEXT,
  timestamp TIME NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water Logs Table
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  timestamp TIME NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fasting Logs Table
CREATE TABLE IF NOT EXISTS fasting_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  duration_text TEXT,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate BMR (Basal Metabolic Rate)
CREATE OR REPLACE FUNCTION calculate_bmr(
  p_weight_kg DECIMAL,
  p_height_cm DECIMAL,
  p_age INTEGER,
  p_gender TEXT
) RETURNS DECIMAL AS $$
DECLARE
  bmr DECIMAL;
BEGIN
  IF p_gender = 'male' THEN
    bmr := (10 * p_weight_kg) + (6.25 * p_height_cm) - (5 * p_age) + 5;
  ELSE
    bmr := (10 * p_weight_kg) + (6.25 * p_height_cm) - (5 * p_age) - 161;
  END IF;
  RETURN bmr;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate TDEE (Total Daily Energy Expenditure)
CREATE OR REPLACE FUNCTION calculate_tdee(
  p_weight_kg DECIMAL,
  p_height_cm DECIMAL,
  p_age INTEGER,
  p_gender TEXT,
  p_activity_level TEXT
) RETURNS DECIMAL AS $$
DECLARE
  bmr DECIMAL;
  activity_multiplier DECIMAL;
  tdee DECIMAL;
BEGIN
  bmr := calculate_bmr(p_weight_kg, p_height_cm, p_age, p_gender);
  
  -- Activity level multipliers
  activity_multiplier := CASE p_activity_level
    WHEN 'Sedentary' THEN 1.2
    WHEN 'Lightly Active' THEN 1.375
    WHEN 'Moderately Active' THEN 1.55
    WHEN 'Active' THEN 1.725
    WHEN 'Very Active' THEN 1.9
    ELSE 1.55
  END;
  
  tdee := bmr * activity_multiplier;
  RETURN tdee;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate daily calorie limit
CREATE OR REPLACE FUNCTION calculate_calorie_limit(
  p_weight_kg DECIMAL,
  p_height_cm DECIMAL,
  p_age INTEGER,
  p_gender TEXT,
  p_activity_level TEXT,
  p_user_goal TEXT
) RETURNS INTEGER AS $$
DECLARE
  tdee DECIMAL;
  target INTEGER;
BEGIN
  tdee := calculate_tdee(p_weight_kg, p_height_cm, p_age, p_gender, p_activity_level);
  
  CASE p_user_goal
    WHEN 'lose' THEN target := FLOOR(tdee * 0.85); -- 15% deficit
    WHEN 'gain' THEN target := FLOOR(tdee * 1.15); -- 15% surplus
    ELSE target := FLOOR(tdee); -- Maintain
  END CASE;
  
  RETURN target;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate XP for activity duration
CREATE OR REPLACE FUNCTION calculate_activity_xp(
  p_category TEXT,
  p_duration_minutes INTEGER
) RETURNS INTEGER AS $$
BEGIN
  IF p_category = 'workout' THEN
    RETURN p_duration_minutes * 10; -- 10 XP per minute
  ELSIF p_category = 'meditation' THEN
    RETURN p_duration_minutes * 5; -- 5 XP per minute
  END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to add XP and handle leveling up
CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
) RETURNS JSON AS $$
DECLARE
  v_current_xp INTEGER;
  v_max_xp INTEGER;
  v_current_level INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_new_max_xp INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Get current stats
  SELECT current_xp, max_xp, current_level
  INTO v_current_xp, v_max_xp, v_current_level
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Add XP
  v_new_xp := v_current_xp + p_xp_amount;
  v_new_level := v_current_level;
  v_new_max_xp := v_max_xp;
  
  -- Check for level up
  WHILE v_new_xp >= v_new_max_xp LOOP
    v_leveled_up := TRUE;
    v_new_xp := v_new_xp - v_new_max_xp;
    v_new_level := v_new_level + 1;
    v_new_max_xp := FLOOR(v_new_max_xp * 1.5); -- Increase by 50%
  END LOOP;
  
  -- Update user profile
  UPDATE user_profiles
  SET 
    current_xp = v_new_xp,
    current_level = v_new_level,
    max_xp = v_new_max_xp,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN json_build_object(
    'current_xp', v_new_xp,
    'current_level', v_new_level,
    'max_xp', v_new_max_xp,
    'leveled_up', v_leveled_up
  );
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID) RETURNS INTEGER AS $$
DECLARE
  v_current_streak INTEGER;
  v_last_activity_date DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT streak_days, last_activity_date
  INTO v_current_streak, v_last_activity_date
  FROM user_profiles
  WHERE id = p_user_id;
  
  IF v_last_activity_date IS NULL OR v_last_activity_date < v_today - INTERVAL '1 day' THEN
    -- Streak broken or first activity
    v_current_streak := 1;
  ELSIF v_last_activity_date = v_today - INTERVAL '1 day' THEN
    -- Continuing streak
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Already updated today
    RETURN v_current_streak;
  END IF;
  
  UPDATE user_profiles
  SET 
    streak_days = v_current_streak,
    last_activity_date = v_today,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN v_current_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to update calorie limit when biometrics change
CREATE OR REPLACE FUNCTION update_calorie_limit_on_biometrics()
RETURNS TRIGGER AS $$
DECLARE
  v_new_limit INTEGER;
BEGIN
  -- Recalculate calorie limit if weight, height, age, gender, activity_level, or goal changes
  IF (TG_OP = 'INSERT' OR 
      (TG_OP = 'UPDATE' AND (
        OLD.weight_kg IS DISTINCT FROM NEW.weight_kg OR
        OLD.height_cm IS DISTINCT FROM NEW.height_cm OR
        OLD.dob IS DISTINCT FROM NEW.dob OR
        OLD.gender IS DISTINCT FROM NEW.gender OR
        OLD.activity_level IS DISTINCT FROM NEW.activity_level OR
        OLD.user_goal IS DISTINCT FROM NEW.user_goal
      ))) THEN
    
    v_new_limit := calculate_calorie_limit(
      NEW.weight_kg,
      NEW.height_cm,
      NEW.age,
      NEW.gender,
      NEW.activity_level,
      NEW.user_goal
    );
    
    NEW.daily_calorie_limit := v_new_limit;
    NEW.updated_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update calorie limit when biometrics change
DROP TRIGGER IF EXISTS trigger_update_calorie_limit ON user_profiles;
CREATE TRIGGER trigger_update_calorie_limit
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_calorie_limit_on_biometrics();

-- Trigger to add XP when food log is created
CREATE OR REPLACE FUNCTION trigger_food_log_xp()
RETURNS TRIGGER AS $$
DECLARE
  v_result JSON;
BEGIN
  v_result := add_user_xp(NEW.user_id, 50); -- 50 XP for food log
  PERFORM update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_food_xp ON food_logs;
CREATE TRIGGER trigger_add_food_xp
  AFTER INSERT ON food_logs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_food_log_xp();

-- Trigger to add XP when water log is created
CREATE OR REPLACE FUNCTION trigger_water_log_xp()
RETURNS TRIGGER AS $$
DECLARE
  v_result JSON;
BEGIN
  v_result := add_user_xp(NEW.user_id, 10); -- 10 XP for water log
  PERFORM update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_water_xp ON water_logs;
CREATE TRIGGER trigger_add_water_xp
  AFTER INSERT ON water_logs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_water_log_xp();

-- Trigger to add XP when activity log is created
CREATE OR REPLACE FUNCTION trigger_activity_log_xp()
RETURNS TRIGGER AS $$
DECLARE
  v_xp INTEGER;
  v_result JSON;
BEGIN
  v_xp := calculate_activity_xp(NEW.category, NEW.duration_minutes);
  v_result := add_user_xp(NEW.user_id, v_xp);
  PERFORM update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_activity_xp ON activity_logs;
CREATE TRIGGER trigger_add_activity_xp
  AFTER INSERT ON activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_activity_log_xp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Food Logs Policies
DROP POLICY IF EXISTS "Users can view own food logs" ON food_logs;
CREATE POLICY "Users can view own food logs"
  ON food_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own food logs" ON food_logs;
CREATE POLICY "Users can insert own food logs"
  ON food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own food logs" ON food_logs;
CREATE POLICY "Users can update own food logs"
  ON food_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own food logs" ON food_logs;
CREATE POLICY "Users can delete own food logs"
  ON food_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Activity Logs Policies
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity logs" ON activity_logs;
CREATE POLICY "Users can insert own activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activity logs" ON activity_logs;
CREATE POLICY "Users can update own activity logs"
  ON activity_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own activity logs" ON activity_logs;
CREATE POLICY "Users can delete own activity logs"
  ON activity_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Water Logs Policies
DROP POLICY IF EXISTS "Users can view own water logs" ON water_logs;
CREATE POLICY "Users can view own water logs"
  ON water_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own water logs" ON water_logs;
CREATE POLICY "Users can insert own water logs"
  ON water_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own water logs" ON water_logs;
CREATE POLICY "Users can update own water logs"
  ON water_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own water logs" ON water_logs;
CREATE POLICY "Users can delete own water logs"
  ON water_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Fasting Logs Policies
DROP POLICY IF EXISTS "Users can view own fasting logs" ON fasting_logs;
CREATE POLICY "Users can view own fasting logs"
  ON fasting_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own fasting logs" ON fasting_logs;
CREATE POLICY "Users can insert own fasting logs"
  ON fasting_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own fasting logs" ON fasting_logs;
CREATE POLICY "Users can update own fasting logs"
  ON fasting_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own fasting logs" ON fasting_logs;
CREATE POLICY "Users can delete own fasting logs"
  ON fasting_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON activity_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_fasting_logs_user_date ON fasting_logs(user_id, log_date);

-- ============================================================================
-- INITIAL DATA (Optional - can be removed if not needed)
-- ============================================================================

-- Note: User profiles will be created automatically when users sign up
-- via the trigger or application logic


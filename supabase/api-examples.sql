-- API Usage Examples
-- These queries demonstrate how to interact with the database
-- Use these as reference for implementing your API endpoints

-- ============================================================================
-- USER PROFILE ENDPOINTS
-- ============================================================================

-- GET /user/profile
-- Returns the user's profile with calculated age and calorie limit
SELECT 
  id,
  name,
  dob,
  gender,
  age,
  height_cm,
  weight_kg,
  activity_level,
  unit_system,
  daily_calorie_limit,
  user_goal,
  active_character_id,
  current_level,
  current_xp,
  max_xp,
  inventory,
  equipped_accessory,
  streak_days,
  created_at,
  updated_at
FROM user_profiles
WHERE id = auth.uid();

-- PATCH /user/profile
-- Update biometrics (triggers calorie recalculation automatically)
UPDATE user_profiles
SET 
  weight_kg = 70.0,
  height_cm = 180.0,
  activity_level = 'Very Active',
  user_goal = 'lose',
  updated_at = NOW()
WHERE id = auth.uid()
RETURNING *;

-- ============================================================================
-- FOOD LOG ENDPOINTS
-- ============================================================================

-- GET /logs/food?date=2025-01-15
SELECT 
  id,
  name,
  calories,
  protein,
  carbs,
  fat,
  category,
  icon,
  display_amount,
  ai_feedback,
  zpd_status,
  image_url,
  timestamp,
  log_date,
  created_at
FROM food_logs
WHERE user_id = auth.uid()
  AND log_date = '2025-01-15'::date
ORDER BY timestamp DESC;

-- GET /logs/food?startDate=2025-01-01&endDate=2025-01-31
SELECT *
FROM food_logs
WHERE user_id = auth.uid()
  AND log_date BETWEEN '2025-01-01'::date AND '2025-01-31'::date
ORDER BY log_date DESC, timestamp DESC;

-- POST /logs/food
-- Returns updated XP and level after insert
INSERT INTO food_logs (
  user_id,
  name,
  calories,
  protein,
  carbs,
  fat,
  category,
  icon,
  display_amount,
  ai_feedback,
  zpd_status,
  image_url,
  timestamp,
  log_date
) VALUES (
  auth.uid(),
  'Carrot Cake Pawpsicle',
  350,
  5,
  45,
  12,
  'sweet',
  '🥕',
  '1 piece',
  'Code Green: Standard herbivore fuel detected!',
  'CLEAR PATH: OPTIMAL FUELING',
  NULL,
  CURRENT_TIME,
  CURRENT_DATE
)
RETURNING 
  *,
  (SELECT json_build_object(
    'current_xp', current_xp,
    'current_level', current_level,
    'max_xp', max_xp
  ) FROM user_profiles WHERE id = auth.uid()) AS user_stats;

-- ============================================================================
-- ACTIVITY LOG ENDPOINTS
-- ============================================================================

-- GET /logs/activity?date=2025-01-15
SELECT 
  id,
  category,
  title,
  icon,
  duration_minutes,
  duration_text,
  calories_burned,
  color,
  timestamp,
  log_date,
  created_at
FROM activity_logs
WHERE user_id = auth.uid()
  AND log_date = '2025-01-15'::date
ORDER BY timestamp DESC;

-- POST /logs/activity (Workout)
-- XP is calculated automatically: duration_minutes * 10
INSERT INTO activity_logs (
  user_id,
  category,
  title,
  icon,
  duration_minutes,
  duration_text,
  calories_burned,
  color,
  timestamp,
  log_date
) VALUES (
  auth.uid(),
  'workout',
  'Tundratown Sprint',
  '🏃',
  25,
  '00:25:00',
  210,
  'blue',
  CURRENT_TIME,
  CURRENT_DATE
)
RETURNING 
  *,
  (SELECT json_build_object(
    'current_xp', current_xp,
    'current_level', current_level,
    'max_xp', max_xp,
    'xp_gained', duration_minutes * 10
  ) FROM user_profiles WHERE id = auth.uid()) AS user_stats;

-- POST /logs/activity (Meditation)
-- XP is calculated automatically: duration_minutes * 5
INSERT INTO activity_logs (
  user_id,
  category,
  title,
  icon,
  duration_minutes,
  duration_text,
  color,
  timestamp,
  log_date
) VALUES (
  auth.uid(),
  'meditation',
  'Morning Mindfulness',
  '🧘',
  15,
  '00:15:00',
  'purple',
  CURRENT_TIME,
  CURRENT_DATE
)
RETURNING 
  *,
  (SELECT json_build_object(
    'current_xp', current_xp,
    'current_level', current_level,
    'max_xp', max_xp,
    'xp_gained', duration_minutes * 5
  ) FROM user_profiles WHERE id = auth.uid()) AS user_stats;

-- ============================================================================
-- WATER LOG ENDPOINTS
-- ============================================================================

-- GET /logs/water?date=2025-01-15
-- Returns total water for the day
SELECT 
  COALESCE(SUM(amount_ml), 0) AS total_water_ml,
  COUNT(*) AS log_count
FROM water_logs
WHERE user_id = auth.uid()
  AND log_date = '2025-01-15'::date;

-- GET /logs/water?date=2025-01-15 (Detailed)
SELECT 
  id,
  amount_ml,
  timestamp,
  log_date,
  created_at
FROM water_logs
WHERE user_id = auth.uid()
  AND log_date = '2025-01-15'::date
ORDER BY timestamp DESC;

-- POST /logs/water
-- Returns updated XP (+10 XP automatically)
INSERT INTO water_logs (
  user_id,
  amount_ml,
  timestamp,
  log_date
) VALUES (
  auth.uid(),
  500,
  CURRENT_TIME,
  CURRENT_DATE
)
RETURNING 
  *,
  (SELECT json_build_object(
    'current_xp', current_xp,
    'current_level', current_level,
    'max_xp', max_xp,
    'xp_gained', 10
  ) FROM user_profiles WHERE id = auth.uid()) AS user_stats;

-- ============================================================================
-- FASTING LOG ENDPOINTS
-- ============================================================================

-- GET /logs/fasting?date=2025-01-15
SELECT 
  id,
  protocol,
  start_time,
  end_time,
  duration_minutes,
  duration_text,
  log_date,
  created_at
FROM fasting_logs
WHERE user_id = auth.uid()
  AND log_date = '2025-01-15'::date
ORDER BY start_time DESC;

-- POST /logs/fasting (Start fasting)
INSERT INTO fasting_logs (
  user_id,
  protocol,
  start_time,
  log_date
) VALUES (
  auth.uid(),
  '16:8 Method',
  NOW(),
  CURRENT_DATE
)
RETURNING *;

-- POST /logs/fasting (End fasting)
-- Update the existing log with end time and calculate duration
UPDATE fasting_logs
SET 
  end_time = NOW(),
  duration_minutes = EXTRACT(EPOCH FROM (NOW() - start_time))::INTEGER / 60,
  duration_text = CONCAT(
    FLOOR(EXTRACT(EPOCH FROM (NOW() - start_time)) / 3600)::TEXT, 'h ',
    FLOOR((EXTRACT(EPOCH FROM (NOW() - start_time)) % 3600) / 60)::TEXT, 'm'
  )
WHERE user_id = auth.uid()
  AND end_time IS NULL
  AND log_date = CURRENT_DATE
RETURNING *;

-- ============================================================================
-- ANALYTICS QUERIES
-- ============================================================================

-- Get daily totals for a date range
SELECT 
  log_date,
  COALESCE((SELECT SUM(calories) FROM food_logs WHERE user_id = auth.uid() AND log_date = d.log_date), 0) AS total_calories,
  COALESCE((SELECT SUM(amount_ml) FROM water_logs WHERE user_id = auth.uid() AND log_date = d.log_date), 0) AS total_water_ml,
  COALESCE((SELECT COUNT(*) FROM activity_logs WHERE user_id = auth.uid() AND log_date = d.log_date AND category = 'workout'), 0) AS workout_count,
  COALESCE((SELECT COUNT(*) FROM activity_logs WHERE user_id = auth.uid() AND log_date = d.log_date AND category = 'meditation'), 0) AS meditation_count
FROM generate_series(
  '2025-01-01'::date,
  '2025-01-31'::date,
  '1 day'::interval
) AS d(log_date)
ORDER BY log_date DESC;

-- Get weekly summary
SELECT 
  DATE_TRUNC('week', log_date) AS week_start,
  SUM(calories) AS total_calories,
  AVG(calories) AS avg_daily_calories,
  SUM(amount_ml) AS total_water_ml,
  COUNT(DISTINCT log_date) AS active_days
FROM (
  SELECT log_date, SUM(calories) AS calories, 0 AS amount_ml
  FROM food_logs
  WHERE user_id = auth.uid()
  GROUP BY log_date
  UNION ALL
  SELECT log_date, 0 AS calories, SUM(amount_ml) AS amount_ml
  FROM water_logs
  WHERE user_id = auth.uid()
  GROUP BY log_date
) AS combined
GROUP BY DATE_TRUNC('week', log_date)
ORDER BY week_start DESC;


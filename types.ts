
export enum Screen {
  WELCOME = 'welcome',
  LOGIN = 'login',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot_password',
  CHARACTER_SELECT = 'character_select',
  USER_DATA = 'user_data',
  GOAL_SELECTION = 'goal_selection',
  FASTING_SETUP = 'fasting_setup',
  PLAN_GENERATION = 'plan_generation',
  HOME = 'home',
  ANALYTICS = 'analytics',
  ACHIEVEMENTS = 'achievements',
  SETTINGS = 'settings',
  COMPANIONS = 'companions',
  FOOD_LOG = 'food_log',
  FOOD_HISTORY = 'food_history',
  WATER_LOG = 'water_log',
  MEDITATION_TIMER = 'meditation_timer',
  WORKOUT_TIMER = 'workout_timer',
  MANUAL_MEDITATION = 'manual_meditation',
  MANUAL_WORKOUT = 'manual_workout',
  WORKOUT_HISTORY = 'workout_history',
  MINDFULNESS_HISTORY = 'mindfulness_history',
  CLAIM_REWARD = 'claim_reward',
  WARDROBE = 'wardrobe',
  SETTINGS_UNITS = 'settings_units',
  SETTINGS_NOTIFICATIONS = 'settings_notifications',
  SETTINGS_APPS = 'settings_apps',
  SETTINGS_MEMBERSHIP = 'settings_membership',
  FASTING_TIMER = 'fasting_timer',
  PROFILE = 'profile',
  BIOMETRICS = 'biometrics',
  AI_LAB = 'ai_lab'
}

export interface ActivityLog {
  id: string;
  title: string;
  icon: string;
  duration: string;
  timestamp: string; // Time of day e.g. "10:30 AM"
  date: string; // ISO Date String YYYY-MM-DD
  calories?: number;
  color?: string;
}

export interface FoodLogItem {
  id: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  micros?: {
    vitA?: string;
    vitC?: string;
    calcium?: string;
    iron?: string;
    fiber?: string;
    sodium?: string;
  };
  icon: string;
  timestamp: string; // Time of day
  date: string; // ISO Date String YYYY-MM-DD
  displayAmount?: string;
}

export interface WaterLogItem {
  id: string;
  amount: number; // in ml
  timestamp: string;
  date: string; // ISO Date String YYYY-MM-DD
}

export interface FastingLog {
  id: string;
  duration: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  image: string;
  themeColor: string;
  quotes: string[];
  onboardingMessages: {
    select: string;
    dataSetup: string;
    goal: string;
    fasting: string;
    plan: string;
  };
  level: number;
  xp: number;
  maxXp: number;
  accessory?: string;
}

export interface UserStats {
  name: string;
  dob: string;
  gender: 'male' | 'female';
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
}

export interface DailyStats {
  calories: {
    current: number;
    target: number;
  };
  water: {
    current: number;
    target: number;
  };
  steps: {
    current: number;
    target: number;
  };
  streak: number;
}

export interface FastingPlanConfig {
  protocol: string;
  fastingHours: number;
  eatingHours: number;
}

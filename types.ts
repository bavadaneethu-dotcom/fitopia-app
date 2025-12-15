
export enum Screen {
  WELCOME = 'welcome',
  LOGIN = 'login',
  SIGNUP = 'signup',
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
  SETTINGS_ANIMATION = 'settings_animation',
  SETTINGS_APPS = 'settings_apps',
  SETTINGS_MEMBERSHIP = 'settings_membership',
  FASTING_TIMER = 'fasting_timer'
}

export interface ActivityLog {
  id: string;
  title: string;
  icon: string;
  duration: string;
  timestamp: string;
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
  icon: string;
  timestamp: string;
  displayAmount?: string;
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

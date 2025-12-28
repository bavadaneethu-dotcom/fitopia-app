import { supabase, FoodLog } from '../supabase';

/**
 * Get food logs for a specific date or date range
 */
export const getFoodLogs = async (date?: string, startDate?: string, endDate?: string): Promise<FoodLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  if (date) {
    query = query.eq('log_date', date);
  } else if (startDate && endDate) {
    query = query.gte('log_date', startDate).lte('log_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching food logs:', error);
    return [];
  }

  return data || [];
};

/**
 * Add a food log entry
 * Returns the log entry and updated user stats (XP, level)
 */
export const addFoodLog = async (foodLog: Omit<FoodLog, 'id' | 'user_id' | 'created_at'>): Promise<{
  foodLog: FoodLog;
  userStats: { current_xp: number; current_level: number; max_xp: number };
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const logData = {
    ...foodLog,
    user_id: user.id
  };

  const { data: newLog, error: logError } = await supabase
    .from('food_logs')
    .insert(logData)
    .select()
    .single();

  if (logError) {
    console.error('Error adding food log:', logError);
    throw logError;
  }

  // Get updated user stats (XP updated by trigger)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('current_xp, current_level, max_xp')
    .eq('id', user.id)
    .single();

  return {
    foodLog: newLog,
    userStats: profile || { current_xp: 0, current_level: 1, max_xp: 1000 }
  };
};

/**
 * Update a food log entry
 */
export const updateFoodLog = async (id: string, updates: Partial<FoodLog>): Promise<FoodLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('food_logs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating food log:', error);
    return null;
  }

  return data;
};

/**
 * Delete a food log entry
 */
export const deleteFoodLog = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting food log:', error);
    return false;
  }

  return true;
};


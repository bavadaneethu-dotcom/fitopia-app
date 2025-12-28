import { supabase, WaterLog } from '../supabase';

/**
 * Get water logs for a specific date
 * Returns total water consumed for the day
 */
export const getWaterLogs = async (date?: string): Promise<{ logs: WaterLog[]; total_ml: number }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { logs: [], total_ml: 0 };

  let query = supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  if (date) {
    query = query.eq('log_date', date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching water logs:', error);
    return { logs: [], total_ml: 0 };
  }

  const logs = data || [];
  const total_ml = logs.reduce((sum, log) => sum + log.amount_ml, 0);

  return { logs, total_ml };
};

/**
 * Add a water log entry
 * Returns the log entry and updated user stats (+10 XP automatically)
 */
export const addWaterLog = async (
  amount_ml: number,
  log_date?: string
): Promise<{
  waterLog: WaterLog;
  userStats: { current_xp: number; current_level: number; max_xp: number; xp_gained: number };
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const today = log_date || new Date().toISOString().split('T')[0];
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

  const logData = {
    user_id: user.id,
    amount_ml,
    timestamp,
    log_date: today
  };

  const { data: newLog, error: logError } = await supabase
    .from('water_logs')
    .insert(logData)
    .select()
    .single();

  if (logError) {
    console.error('Error adding water log:', logError);
    throw logError;
  }

  // Get updated user stats (XP updated by trigger)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('current_xp, current_level, max_xp')
    .eq('id', user.id)
    .single();

  return {
    waterLog: newLog,
    userStats: {
      ...(profile || { current_xp: 0, current_level: 1, max_xp: 1000 }),
      xp_gained: 10
    }
  };
};

/**
 * Update a water log entry
 */
export const updateWaterLog = async (id: string, updates: Partial<WaterLog>): Promise<WaterLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('water_logs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating water log:', error);
    return null;
  }

  return data;
};

/**
 * Delete a water log entry
 */
export const deleteWaterLog = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting water log:', error);
    return false;
  }

  return true;
};


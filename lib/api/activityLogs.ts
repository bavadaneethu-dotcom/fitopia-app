import { supabase, ActivityLog } from '../supabase';

/**
 * Get activity logs (workouts/meditation) for a specific date or date range
 */
export const getActivityLogs = async (
  category?: 'workout' | 'meditation',
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<ActivityLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (date) {
    query = query.eq('log_date', date);
  } else if (startDate && endDate) {
    query = query.gte('log_date', startDate).lte('log_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }

  return data || [];
};

/**
 * Add an activity log (workout or meditation)
 * XP is calculated automatically by database trigger
 */
export const addActivityLog = async (
  activityLog: Omit<ActivityLog, 'id' | 'user_id' | 'created_at'>
): Promise<{
  activityLog: ActivityLog;
  userStats: { current_xp: number; current_level: number; max_xp: number; xp_gained: number };
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const logData = {
    ...activityLog,
    user_id: user.id
  };

  const { data: newLog, error: logError } = await supabase
    .from('activity_logs')
    .insert(logData)
    .select()
    .single();

  if (logError) {
    console.error('Error adding activity log:', logError);
    throw logError;
  }

  // Get updated user stats (XP updated by trigger)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('current_xp, current_level, max_xp')
    .eq('id', user.id)
    .single();

  // Calculate XP gained
  const xpGained = activityLog.category === 'workout' 
    ? activityLog.duration_minutes * 10 
    : activityLog.duration_minutes * 5;

  return {
    activityLog: newLog,
    userStats: {
      ...(profile || { current_xp: 0, current_level: 1, max_xp: 1000 }),
      xp_gained: xpGained
    }
  };
};

/**
 * Update an activity log
 */
export const updateActivityLog = async (id: string, updates: Partial<ActivityLog>): Promise<ActivityLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('activity_logs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating activity log:', error);
    return null;
  }

  return data;
};

/**
 * Delete an activity log
 */
export const deleteActivityLog = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('activity_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting activity log:', error);
    return false;
  }

  return true;
};


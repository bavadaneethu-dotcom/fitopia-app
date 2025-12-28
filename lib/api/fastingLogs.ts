import { supabase, FastingLog } from '../supabase';

/**
 * Get fasting logs for a specific date or date range
 */
export const getFastingLogs = async (date?: string, startDate?: string, endDate?: string): Promise<FastingLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('fasting_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false });

  if (date) {
    query = query.eq('log_date', date);
  } else if (startDate && endDate) {
    query = query.gte('log_date', startDate).lte('log_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching fasting logs:', error);
    return [];
  }

  return data || [];
};

/**
 * Start a fasting session
 */
export const startFasting = async (protocol: string): Promise<FastingLog> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const today = new Date().toISOString().split('T')[0];
  const startTime = new Date().toISOString();

  const logData = {
    user_id: user.id,
    protocol,
    start_time: startTime,
    end_time: null,
    duration_minutes: null,
    duration_text: null,
    log_date: today
  };

  const { data: newLog, error } = await supabase
    .from('fasting_logs')
    .insert(logData)
    .select()
    .single();

  if (error) {
    console.error('Error starting fasting:', error);
    throw error;
  }

  return newLog;
};

/**
 * End a fasting session
 * Calculates duration and updates the log
 */
export const endFasting = async (logId?: string): Promise<FastingLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const today = new Date().toISOString().split('T')[0];
  const endTime = new Date().toISOString();

  // Find the active fasting log (no end_time)
  let query = supabase
    .from('fasting_logs')
    .select('*')
    .eq('user_id', user.id)
    .is('end_time', null)
    .eq('log_date', today)
    .order('start_time', { ascending: false })
    .limit(1);

  if (logId) {
    query = query.eq('id', logId);
  }

  const { data: activeLog, error: fetchError } = await query.single();

  if (fetchError || !activeLog) {
    console.error('No active fasting session found');
    return null;
  }

  // Calculate duration
  const startTime = new Date(activeLog.start_time);
  const durationMs = new Date(endTime).getTime() - startTime.getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationText = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

  // Update the log
  const { data: updatedLog, error: updateError } = await supabase
    .from('fasting_logs')
    .update({
      end_time: endTime,
      duration_minutes: durationMinutes,
      duration_text: durationText
    })
    .eq('id', activeLog.id)
    .select()
    .single();

  if (updateError) {
    console.error('Error ending fasting:', updateError);
    return null;
  }

  return updatedLog;
};

/**
 * Get active fasting session (if any)
 */
export const getActiveFasting = async (): Promise<FastingLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('fasting_logs')
    .select('*')
    .eq('user_id', user.id)
    .is('end_time', null)
    .eq('log_date', today)
    .order('start_time', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};


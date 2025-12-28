import { supabase, UserProfile } from '../supabase';

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const profileData = {
    id: user.id,
    ...profile,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }

  return data;
};

/**
 * Update biometrics (triggers calorie recalculation automatically)
 */
export const updateBiometrics = async (updates: {
  weight_kg?: number;
  height_cm?: number;
  dob?: string;
  gender?: 'male' | 'female';
  activity_level?: string;
  user_goal?: 'lose' | 'maintain' | 'gain';
}): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating biometrics:', error);
    throw error;
  }

  return data;
};


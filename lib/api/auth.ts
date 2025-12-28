import { supabase } from '../supabase';
import { UserProfile } from '../supabase';

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, userData: {
  name: string;
  dob: string;
  gender: 'male' | 'female';
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  unit_system: 'metric' | 'imperial';
  user_goal: 'lose' | 'maintain' | 'gain';
}): Promise<{ user: any; profile: UserProfile | null }> => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  // Create user profile
  const profileData: Partial<UserProfile> = {
    id: authData.user.id,
    name: userData.name,
    dob: userData.dob,
    gender: userData.gender,
    height_cm: userData.height_cm,
    weight_kg: userData.weight_kg,
    activity_level: userData.activity_level,
    unit_system: userData.unit_system,
    user_goal: userData.user_goal
  };

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .insert(profileData)
    .select()
    .single();

  if (profileError) {
    console.error('Error creating profile:', profileError);
    // Don't throw - profile might be created by trigger
  }

  return {
    user: authData.user,
    profile: profile || null
  };
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/fitopia-app/reset-password`
  });
  if (error) throw error;
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
};


import { supabase } from '../../supabase';

export const api = {
    auth: {
        signUp: async (email: string, password: string, name: string) => {
            // 1. Sign up user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });

            if (error) throw error;

            // 2. CHECK if profile exists (Trigger Fallback)
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                // If no profile found, manually create it (Fallback for trigger failure)
                if (!profile) {
                    console.log("Trigger may have failed. Creating profile manually...");
                    await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                email: email,
                                name: name,
                                stats: {},
                                character: {},
                                inventory: []
                            }
                        ]);
                }
            }

            return data;
        },

        signIn: async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },

        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },

        getUser: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        }
    },

    profiles: {
        get: async (userId: string) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        },

        update: async (userId: string, updates: any) => {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },

    logs: {
        // Fetch ALL logs for a user (needed for Profile stats, Analytics, and seamless date switching)
        getAll: async (userId: string) => {
            const [activity, food, water, fasting, weight] = await Promise.all([
                supabase.from('activity_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
                supabase.from('food_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
                supabase.from('water_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
                supabase.from('fasting_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
                supabase.from('weight_logs').select('*').eq('user_id', userId).order('date', { ascending: false })
            ]);

            if (activity.error) throw activity.error;
            if (food.error) throw food.error;
            if (water.error) throw water.error;
            if (fasting.error) throw fasting.error;
            if (weight.error) throw weight.error;

            return {
                activity: activity.data || [],
                food: food.data || [],
                water: water.data || [],
                fasting: fasting.data || [],
                weight: weight.data || []
            };
        },

        // Generic Add
        add: async (table: 'activity_logs' | 'food_logs' | 'water_logs' | 'fasting_logs' | 'weight_logs', data: any) => {
            const { data: result, error } = await supabase
                .from(table)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return result;
        },

        // Generic Update
        update: async (table: 'activity_logs' | 'food_logs' | 'water_logs' | 'fasting_logs' | 'weight_logs', id: string, updates: any) => {
            const { data, error } = await supabase
                .from(table)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        // Generic Delete
        delete: async (table: 'activity_logs' | 'food_logs' | 'water_logs' | 'fasting_logs' | 'weight_logs', id: string) => {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
        }
    }
};

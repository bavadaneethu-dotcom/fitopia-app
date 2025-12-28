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
                .eq('id', userId);

            if (error) throw error;
            return data;
        }
    }
};

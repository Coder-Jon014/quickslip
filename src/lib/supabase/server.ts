import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function createSupabaseServerClient() {
    const { getToken, userId } = await auth();

    // Try to get the Supabase token, but fall back to anon key if template doesn't exist
    let token = null;
    try {
        token = await getToken({ template: 'supabase' });
    } catch (error) {
        console.warn('Supabase JWT template not found in Clerk. Using anon key. Please create a "supabase" JWT template in your Clerk dashboard.');
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        token ? {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        } : undefined
    );
}

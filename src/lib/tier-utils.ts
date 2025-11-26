import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tier } from "@/types/db";

export const FREE_TIER_RECEIPT_LIMIT = 10;

export async function getUserTier(userId: string): Promise<Tier> {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from('users')
        .select('tier')
        .eq('clerk_id', userId)
        .single();

    return (data?.tier as Tier) || 'free';
}

export async function getRecentReceiptCount(userId: string): Promise<number> {
    const supabase = await createSupabaseServerClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('deleted_at', null)
        .gte('issued_date', thirtyDaysAgo.toISOString());

    return count || 0;
}

export async function canCreateReceipt(userId: string): Promise<{ allowed: boolean; reason?: 'limit_reached' }> {
    const tier = await getUserTier(userId);

    if (tier === 'pro') {
        return { allowed: true };
    }

    const count = await getRecentReceiptCount(userId);

    if (count >= FREE_TIER_RECEIPT_LIMIT) {
        return { allowed: false, reason: 'limit_reached' };
    }

    return { allowed: true };
}

export async function canEditReceipt(userId: string): Promise<boolean> {
    const tier = await getUserTier(userId);
    return tier === 'pro';
}

export async function canDeleteReceipt(userId: string): Promise<boolean> {
    const tier = await getUserTier(userId);
    return tier === 'pro';
}

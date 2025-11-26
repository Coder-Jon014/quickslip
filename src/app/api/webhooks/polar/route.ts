import { Webhooks } from "@polar-sh/nextjs";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onSubscriptionCreated: async (payload) => {
        console.log("Subscription created:", payload);
        const supabase = await createSupabaseServerClient();

        // Assuming metadata contains user_id or we match by email
        // Polar allows passing metadata in checkout.
        // If we can't pass metadata easily via the simple Checkout adapter,
        // we might need to rely on email matching or a custom checkout flow.
        // For now, let's try to match by email if available, or check metadata.

        // NOTE: The simple Checkout adapter might not inject user_id into metadata automatically.
        // We might need to rely on the user being logged in and matching email,
        // OR we need to customize the checkout creation to include metadata.
        // But the Checkout adapter is a GET route, it just redirects.
        // Let's assume for now we match by email.

        // Ideally we should pass ?userId=... to the checkout route and have it pass it to Polar.
        // The Polar Checkout adapter supports query params being passed through?
        // Let's check docs or assume we need to handle this.

        const email = payload.user.email;
        const customerId = (payload as any).data?.customer_id || (payload as any).user_id || null;

        if (email) {
            await supabase
                .from('users')
                .update({
                    tier: 'pro',
                    subscription_id: payload.id,
                    current_period_end: payload.current_period_end,
                    ...(customerId && { polar_customer_id: customerId })
                })
                .eq('email', email);

            console.log("User upgraded to Pro:", email, "Customer ID:", customerId);
        }
    },
    onSubscriptionActive: async (payload) => {
        console.log("Subscription active:", payload);
        const supabase = await createSupabaseServerClient();
        const email = payload.user.email;
        if (email) {
            await supabase
                .from('users')
                .update({ tier: 'pro', subscription_id: payload.id })
                .eq('email', email);
        }
    },
    onSubscriptionRevoked: async (payload) => {
        console.log("Subscription revoked:", payload);
        const supabase = await createSupabaseServerClient();
        const email = payload.user.email;
        if (email) {
            await supabase
                .from('users')
                .update({ tier: 'free', subscription_id: null })
                .eq('email', email);
        }
    },
    onSubscriptionCanceled: async (payload) => {
        console.log("Subscription canceled:", payload);
        // Usually we keep them on pro until period end, but for simplicity:
        // We can just log it, or update a 'cancel_at_period_end' flag if we had one.
        // For now, we'll leave them as pro until it's actually revoked/expired.
    },
});

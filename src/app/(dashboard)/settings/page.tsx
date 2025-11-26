import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserTier } from "@/lib/tier-utils";

export default async function SettingsPage() {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const supabase = await createSupabaseServerClient();
    const tier = await getUserTier(userId);

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', userId)
        .single();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-zinc-400">Manage your account and subscription</p>
            </div>

            {/* Subscription Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-medium text-white mb-4">Subscription</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">Current Plan</p>
                            <p className="text-white font-medium capitalize">{tier} Tier</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${tier === 'pro'
                                ? 'bg-brand-500/10 text-brand-400'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}>
                            {tier === 'pro' ? 'Active' : 'Free'}
                        </div>
                    </div>

                    {tier === 'pro' ? (
                        <>
                            {user?.current_period_end && (
                                <div>
                                    <p className="text-sm text-zinc-400">Next Billing Date</p>
                                    <p className="text-white">
                                        {new Date(user.current_period_end).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-zinc-800">
                                <Link
                                    href="/api/portal"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Icon icon="solar:settings-bold-duotone" />
                                    Manage Subscription
                                </Link>
                                <p className="text-xs text-zinc-500 mt-2">
                                    Update payment method, view invoices, or cancel your subscription
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="pt-4 border-t border-zinc-800">
                            <Link
                                href="/#pricing"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-400 hover:bg-brand-300 text-black rounded-lg text-sm font-medium transition-colors"
                            >
                                <Icon icon="solar:restart-bold-duotone" />
                                Upgrade to Pro
                            </Link>
                            <p className="text-xs text-zinc-500 mt-2">
                                Unlock unlimited receipts, editing, and more
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-medium text-white mb-4">Account</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-zinc-400">Email</p>
                        <p className="text-white">{user?.email || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400">User ID</p>
                        <p className="text-white text-xs font-mono">{userId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingTableProps {
    className?: string;
    showTitle?: boolean;
}

export function PricingTable({ className, showTitle = true }: PricingTableProps) {
    return (
        <div className={cn("w-full max-w-5xl mx-auto px-4", className)}>
            {showTitle && (
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Start for free, upgrade when you need more power. No hidden fees.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Free Starter</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-zinc-500">/month</span>
                        </div>
                        <p className="text-zinc-400 mt-4 text-sm">Perfect for freelancers just getting started.</p>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <Icon icon="solar:check-circle-bold" className="text-zinc-500 text-lg" />
                            <span>10 Receipts per month</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <Icon icon="solar:check-circle-bold" className="text-zinc-500 text-lg" />
                            <span>Basic PDF Templates</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <Icon icon="solar:check-circle-bold" className="text-zinc-500 text-lg" />
                            <span>Client Management</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <Icon icon="solar:close-circle-bold" className="text-zinc-700 text-lg" />
                            <span>No Editing or Deleting</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <Icon icon="solar:close-circle-bold" className="text-zinc-700 text-lg" />
                            <span>No Custom Branding</span>
                        </div>
                    </div>

                    <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
                        Current Plan
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-zinc-900/80 border border-brand-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-brand-500/10">
                    <div className="absolute top-0 right-0 bg-brand-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                        POPULAR
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Pro Business</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg text-zinc-600 line-through font-medium">$12</span>
                            <span className="text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">$9</span>
                            <span className="text-zinc-500">/month</span>
                        </div>
                        <p className="text-brand-200/80 mt-4 text-sm">For growing businesses that need flexibility.</p>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icon icon="solar:check-circle-bold" className="text-brand-400 text-lg" />
                            <span>Unlimited Receipts</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icon icon="solar:check-circle-bold" className="text-brand-400 text-lg" />
                            <span>Edit & Delete Receipts</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icon icon="solar:check-circle-bold" className="text-brand-400 text-lg" />
                            <span>Custom Logo & Branding</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icon icon="solar:check-circle-bold" className="text-brand-400 text-lg" />
                            <span>Priority Support</span>
                        </div>
                    </div>

                    <Link
                        href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID}`}
                        className="block w-full text-center py-3 px-4 bg-brand-400 hover:bg-brand-300 text-black rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20"
                    >
                        Upgrade to Pro
                    </Link>
                </div>
            </div>
        </div>
    );
}

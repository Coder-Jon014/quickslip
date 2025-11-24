import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const { userId } = await auth();
    const supabase = await createSupabaseServerClient();

    // Fetch recent receipts
    const { data: receipts } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch weekly income
    const { data: incomeData } = await supabase
        .from('weekly_income_view')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(1);

    const currentWeekIncome = incomeData?.[0]?.total_income || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-zinc-400">Welcome back, here's what's happening with your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                            <Icon icon="solar:wallet-money-bold-duotone" className="text-xl" />
                        </div>
                        <span className="text-zinc-400 text-sm font-medium">Weekly Income</span>
                    </div>
                    <div className="text-3xl font-semibold text-white">${Number(currentWeekIncome).toFixed(2)}</div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Icon icon="solar:bill-check-bold-duotone" className="text-xl" />
                        </div>
                        <span className="text-zinc-400 text-sm font-medium">Receipts Sent</span>
                    </div>
                    <div className="text-3xl font-semibold text-white">{receipts?.length || 0}</div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <Icon icon="solar:users-group-rounded-bold-duotone" className="text-xl" />
                        </div>
                        <span className="text-zinc-400 text-sm font-medium">Active Clients</span>
                    </div>
                    <div className="text-3xl font-semibold text-white">--</div>
                </div>
            </div>

            {/* Recent Receipts */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-white">Recent Receipts</h2>
                    <Link href="/receipts" className="text-sm text-brand-400 hover:text-brand-300">View All</Link>
                </div>

                {receipts && receipts.length > 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-3">Receipt #</th>
                                        <th className="px-6 py-3">Client</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((receipt: any) => (
                                        <tr key={receipt.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{receipt.receipt_number}</td>
                                            <td className="px-6 py-4 text-zinc-300">{receipt.client_name}</td>
                                            <td className="px-6 py-4 text-zinc-400">{new Date(receipt.issued_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-white">${receipt.total}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${receipt.status === 'paid' ? 'bg-brand-500/10 text-brand-400' :
                                                        receipt.status === 'sent' ? 'bg-blue-500/10 text-blue-400' :
                                                            'bg-zinc-800 text-zinc-400'
                                                    }`}>
                                                    {receipt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon icon="solar:document-add-bold-duotone" className="text-2xl text-zinc-400" />
                        </div>
                        <h3 className="text-white font-medium mb-2">No receipts yet</h3>
                        <p className="text-zinc-500 mb-6">Create your first receipt to start tracking your income.</p>
                        <Link href="/receipts/new" className="bg-brand-400 hover:bg-brand-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                            <Icon icon="solar:add-circle-bold-duotone" /> Create Receipt
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

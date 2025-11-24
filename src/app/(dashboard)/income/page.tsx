import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import { auth } from "@clerk/nextjs/server";

export default async function IncomePage() {
    const { userId } = await auth();
    const supabase = await createSupabaseServerClient();

    const { data: incomeData } = await supabase
        .from('weekly_income_view')
        .select('*')
        .order('week_start', { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">Income Tracker</h1>
                <p className="text-zinc-400">Track your weekly earnings.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-3">Week Starting</th>
                            <th className="px-6 py-3">Receipts</th>
                            <th className="px-6 py-3">Total Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeData?.map((week: any) => (
                            <tr key={week.week_start} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/30 transition-colors">
                                <td className="px-6 py-4 text-zinc-300">{new Date(week.week_start).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-zinc-400">{week.receipt_count}</td>
                                <td className="px-6 py-4 text-white font-medium">${week.total_income}</td>
                            </tr>
                        ))}
                        {!incomeData?.length && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">No income data available yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";
import { Icon } from "@/components/ui/icon";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function ExportPage() {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = createClerkSupabaseClient(token!);

            const { data, error } = await supabase.from('receipts').select('*').csv();

            if (error) throw error;

            // Download CSV
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipts-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">Export Data</h1>
                <p className="text-zinc-400">Download your financial data.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 max-w-xl">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                        <Icon icon="solar:export-bold-duotone" className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-1">Export Receipts CSV</h3>
                        <p className="text-sm text-zinc-400">Download a CSV file containing all your receipt data, including client details, amounts, and status.</p>
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    disabled={loading}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? 'Exporting...' : <><Icon icon="solar:download-minimalistic-bold-duotone" /> Download CSV</>}
                </button>
            </div>
        </div>
    );
}

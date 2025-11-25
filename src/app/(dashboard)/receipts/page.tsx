import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function ReceiptsPage() {
    const { userId } = await auth();
    const supabase = await createSupabaseServerClient();

    const { data: receipts } = await supabase
        .from('receipts')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">My Receipts</h1>
                    <p className="text-zinc-400">Manage and track all your generated receipts.</p>
                </div>
                <Link href="/receipts/new" className="bg-brand-400 hover:bg-brand-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Icon icon="solar:add-circle-bold-duotone" /> Create Receipt
                </Link>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                {receipts && receipts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3">Receipt #</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
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
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/receipts/${receipt.id}`} className="text-zinc-400 hover:text-white transition-colors">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon icon="solar:documents-bold-duotone" className="text-2xl text-zinc-400" />
                        </div>
                        <h3 className="text-white font-medium mb-2">No receipts found</h3>
                        <p className="text-zinc-500 mb-6">You haven't created any receipts yet.</p>
                        <Link href="/receipts/new" className="text-brand-400 hover:text-brand-300 font-medium">
                            Create your first receipt
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

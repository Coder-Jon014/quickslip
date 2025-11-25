"use client";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { generateReceiptPDF } from "@/lib/pdf/generator";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DbReceipt, ReceiptItem } from "@/types/db";

export function ReceiptView({ receipt }: { receipt: DbReceipt }) {
    const { getToken } = useAuth();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this receipt?")) return;
        setDeleting(true);

        try {
            const token = await getToken({ template: 'supabase' });
            const supabase = createClerkSupabaseClient(token!);

            const { error } = await supabase
                .from('receipts')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', receipt.id);

            if (error) throw error;

            router.push('/receipts');
            router.refresh();
        } catch (error) {
            console.error("Error deleting receipt:", error);
            alert("Failed to delete receipt");
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/receipts" className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-2">
                        <Icon icon="solar:arrow-left-linear" /> Back to Receipts
                    </Link>
                    <h1 className="text-2xl font-semibold text-white">Receipt #{receipt.receipt_number}</h1>
                </div>
                <div className="flex gap-4">
                    <Link
                        href={`/receipts/${receipt.id}/edit`}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Icon icon="solar:pen-bold-duotone" /> Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        {deleting ? 'Deleting...' : <><Icon icon="solar:trash-bin-trash-bold-duotone" /> Delete</>}
                    </button>
                    <button
                        onClick={() => generateReceiptPDF(receipt)}
                        className="bg-brand-400 hover:bg-brand-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Icon icon="solar:download-minimalistic-bold-duotone" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Receipt Preview UI */}
            <div className="bg-white text-black p-12 rounded-xl shadow-lg max-w-3xl mx-auto">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-600 mb-1">RECEIPT</h2>
                        <p className="text-sm text-gray-500">#{receipt.receipt_number}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Date Issued</div>
                        <div className="font-medium">{new Date(receipt.issued_date).toLocaleDateString()}</div>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="text-sm text-gray-500 mb-2">Bill To:</div>
                    <div className="font-bold text-lg">{receipt.client_name}</div>
                    {receipt.client_email && <div className="text-gray-600">{receipt.client_email}</div>}
                </div>

                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-brand-500">
                            <th className="text-left py-3 font-bold text-brand-600">Description</th>
                            <th className="text-center py-3 font-bold text-brand-600 w-24">Qty</th>
                            <th className="text-right py-3 font-bold text-brand-600 w-32">Rate</th>
                            <th className="text-right py-3 font-bold text-brand-600 w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipt.items.map((item: ReceiptItem, i: number) => (
                            <tr key={i} className="border-b border-gray-100">
                                <td className="py-4">{item.description}</td>
                                <td className="py-4 text-center">{item.quantity}</td>
                                <td className="py-4 text-right">${Number(item.rate).toFixed(2)}</td>
                                <td className="py-4 text-right font-medium">${Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${Number(receipt.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>${Number(receipt.tax).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-black font-bold text-xl pt-3 border-t border-gray-200">
                            <span>Total</span>
                            <span>${Number(receipt.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {receipt.notes && (
                    <div className="border-t border-gray-100 pt-6">
                        <div className="text-sm font-bold text-gray-900 mb-1">Notes</div>
                        <p className="text-sm text-gray-600">{receipt.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

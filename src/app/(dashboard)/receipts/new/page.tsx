"use client";
import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { UpgradeModal } from "@/components/ui/upgrade-modal";

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface Client {
    id: string;
    name: string;
    email: string;
}

export default function NewReceiptPage() {
    const router = useRouter();
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);

    const [formData, setFormData] = useState({
        receiptNumber: `REC-${Math.floor(Math.random() * 10000)}`,
        clientId: "",
        clientName: "",
        clientEmail: "",
        issuedDate: new Date().toISOString().split('T')[0],
        paymentMethod: "Bank Transfer",
        notes: "",
        status: "draft"
    });

    const [items, setItems] = useState<LineItem[]>([
        { id: '1', description: "", quantity: 1, rate: 0, amount: 0 }
    ]);

    useEffect(() => {
        const fetchClients = async () => {
            if (!userId) return;
            try {
                const token = await getToken({ template: 'supabase' });
                const supabase = createClerkSupabaseClient(token!);
                const { data } = await supabase.from('clients').select('id, name, email').order('name');
                if (data) setClients(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, [userId, getToken]);

    const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId === "new") {
            setFormData({ ...formData, clientId: "", clientName: "", clientEmail: "" });
        } else {
            const client = clients.find(c => c.id === selectedId);
            if (client) {
                setFormData({
                    ...formData,
                    clientId: client.id,
                    clientName: client.name,
                    clientEmail: client.email || ""
                });
            }
        }
    };

    const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = Number(updated.quantity) * Number(updated.rate);
                }
                return updated;
            }
            return item;
        }));
    };

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0, amount: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = 0; // Simple for now
    const total = subtotal + tax;

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/receipts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receipt_number: formData.receiptNumber,
                    client_id: formData.clientId || null,
                    client_name: formData.clientName,
                    client_email: formData.clientEmail,
                    items: items,
                    subtotal,
                    tax,
                    total,
                    payment_method: formData.paymentMethod,
                    notes: formData.notes,
                    status: formData.status,
                    issued_date: formData.issuedDate
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 403 && data.code === 'LIMIT_REACHED') {
                    setShowUpgradeModal(true);
                    setLoading(false);
                    return;
                }
                throw new Error('Failed to create receipt');
            }

            router.push('/dashboard');
            router.refresh();

        } catch (error) {
            console.error("Error creating receipt:", error);
            alert("Failed to create receipt");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/dashboard" className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-2">
                        <Icon icon="solar:arrow-left-linear" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-semibold text-white">Create New Receipt</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Client Info Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-medium text-white mb-4">Receipt Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Receipt Number</label>
                            <input
                                type="text"
                                value={formData.receiptNumber}
                                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Date Issued</label>
                            <input
                                type="date"
                                value={formData.issuedDate}
                                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-zinc-400">Select Client</label>
                            <select
                                onChange={handleClientSelect}
                                value={formData.clientId || "new"}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            >
                                <option value="new">-- Enter New Client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Client Name</label>
                            <input
                                type="text"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                placeholder="e.g. Acme Corp"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Client Email (Optional)</label>
                            <input
                                type="email"
                                value={formData.clientEmail}
                                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                placeholder="client@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                            >
                                <option value="draft">Draft</option>
                                <option value="sent">Sent</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Payment Method</label>
                            <input
                                type="text"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                                placeholder="e.g. Bank Transfer"
                            />
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-white">Line Items</h2>
                        <button type="button" onClick={addItem} className="text-sm text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
                            <Icon icon="solar:add-circle-bold-duotone" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-6 space-y-1">
                                    <label className="text-xs text-zinc-500">Description</label>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                        placeholder="Item description"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs text-zinc-500">Qty</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs text-zinc-500">Rate</label>
                                    <input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-zinc-500">Amount</label>
                                        <div className="px-3 py-2 text-sm text-white font-medium bg-zinc-900/50 rounded-lg border border-zinc-800">
                                            ${item.amount.toFixed(2)}
                                        </div>
                                    </div>
                                    {items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors mb-0.5">
                                            <Icon icon="solar:trash-bin-trash-bold-duotone" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-zinc-800 pt-6 flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Tax (0%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-semibold text-lg pt-3 border-t border-zinc-800">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/dashboard" className="px-6 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-400 hover:bg-brand-300 text-black px-8 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Create Receipt'}
                    </button>
                </div>
            </form>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                title="Limit Reached"
                description="You've reached the limit of 10 receipts per month on the Free plan. Upgrade to Pro to create unlimited receipts."
            />
        </div>
    );
}

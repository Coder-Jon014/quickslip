"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function NewClientPage() {
    const router = useRouter();
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken({ template: 'supabase' });
            if (!token) throw new Error("No token");

            const supabase = createClerkSupabaseClient(token);

            const { error } = await supabase.from('clients').insert({
                user_id: userId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });

            if (error) throw error;

            router.push('/clients');
            router.refresh();

        } catch (error) {
            console.error("Error creating client:", error);
            alert("Failed to create client");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/clients" className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-2">
                        <Icon icon="solar:arrow-left-linear" /> Back to Clients
                    </Link>
                    <h1 className="text-2xl font-semibold text-white">Add New Client</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Client Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="e.g. Acme Corp"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="client@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/clients" className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-400 hover:bg-brand-300 text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Create Client'}
                    </button>
                </div>
            </form>
        </div>
    );
}

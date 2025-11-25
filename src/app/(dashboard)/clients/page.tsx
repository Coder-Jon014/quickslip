import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DbClient } from "@/types/db";

export default async function ClientsPage() {
    const { userId } = await auth();
    const supabase = await createSupabaseServerClient();

    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Clients</h1>
                    <p className="text-zinc-400">Manage your client database.</p>
                </div>
                <Link href="/clients/new" className="bg-brand-400 hover:bg-brand-300 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Icon icon="solar:add-circle-bold-duotone" /> Add Client
                </Link>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                {clients && clients.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Added</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client: DbClient) => (
                                    <tr key={client.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                                        <td className="px-6 py-4 text-zinc-300">{client.email || '-'}</td>
                                        <td className="px-6 py-4 text-zinc-400">{client.phone || '-'}</td>
                                        <td className="px-6 py-4 text-zinc-500">{new Date(client.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/clients/${client.id}/edit`} className="text-zinc-500 hover:text-white transition-colors">
                                                <Icon icon="solar:pen-bold-duotone" className="text-lg" />
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
                            <Icon icon="solar:users-group-rounded-bold-duotone" className="text-2xl text-zinc-400" />
                        </div>
                        <h3 className="text-white font-medium mb-2">No clients yet</h3>
                        <p className="text-zinc-500 mb-6">Add your first client to get started.</p>
                        <Link href="/clients/new" className="text-brand-400 hover:text-brand-300 font-medium">
                            Add Client
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

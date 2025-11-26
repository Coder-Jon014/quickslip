import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReceiptView } from "./receipt-view";
import { auth } from "@clerk/nextjs/server";

import { getUserTier } from "@/lib/tier-utils";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: receipt } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

    if (!receipt) {
        notFound();
    }

    const tier = userId ? await getUserTier(userId) : 'free';

    return <ReceiptView receipt={receipt} userTier={tier} />;
}

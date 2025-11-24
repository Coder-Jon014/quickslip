import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReceiptView } from "./receipt-view";
import { auth } from "@clerk/nextjs/server";

export default async function ReceiptPage({ params }: { params: { id: string } }) {
    const { userId } = await auth();
    const supabase = await createSupabaseServerClient();

    const { data: receipt } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!receipt) {
        notFound();
    }

    return <ReceiptView receipt={receipt} />;
}

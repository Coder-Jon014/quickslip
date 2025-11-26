import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canDeleteReceipt } from "@/lib/tier-utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const canDelete = await canDeleteReceipt(userId);
        if (!canDelete) {
            return NextResponse.json(
                { error: "Pro tier required to delete receipts", code: "TIER_RESTRICTED" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const supabase = await createSupabaseServerClient();

        const { error } = await supabase
            .from('receipts')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', userId); // Ensure ownership

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[RECEIPT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

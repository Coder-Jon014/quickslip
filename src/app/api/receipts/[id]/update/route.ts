import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canEditReceipt } from "@/lib/tier-utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const canEdit = await canEditReceipt(userId);
        if (!canEdit) {
            return NextResponse.json(
                { error: "Pro tier required to edit receipts", code: "TIER_RESTRICTED" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await req.json();
        const supabase = await createSupabaseServerClient();

        const { error } = await supabase
            .from('receipts')
            .update({
                ...body,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId); // Ensure ownership

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[RECEIPT_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

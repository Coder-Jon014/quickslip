import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canCreateReceipt } from "@/lib/tier-utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { allowed, reason } = await canCreateReceipt(userId);

        if (!allowed) {
            return NextResponse.json(
                { error: "Free tier limit reached", code: "LIMIT_REACHED" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const supabase = await createSupabaseServerClient();

        // Ensure user record exists (idempotent check)
        const { data: userRecord } = await supabase.from('users').select('clerk_id').eq('clerk_id', userId).single();
        if (!userRecord) {
            await supabase.from('users').insert({
                clerk_id: userId,
                email: "", // These are usually handled by webhook, but safe fallback
                full_name: ""
            });
        }

        const { data, error } = await supabase.from('receipts').insert({
            ...body,
            user_id: userId,
            // Ensure these are set by server or validated
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }).select().single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (error) {
        console.error("[RECEIPTS_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

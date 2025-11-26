import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSignedDownloadUrl } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const supabase = await createSupabaseServerClient();

        // Fetch receipt to get S3 key and verify ownership
        const { data: receipt, error } = await supabase
            .from('receipts')
            .select('pdf_url, user_id')
            .eq('id', id)
            .single();

        if (error || !receipt) {
            return new NextResponse("Receipt not found", { status: 404 });
        }

        if (receipt.user_id !== userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!receipt.pdf_url) {
            return new NextResponse("PDF not generated", { status: 404 });
        }

        // Generate signed URL
        const signedUrl = await getSignedDownloadUrl(receipt.pdf_url);

        // Redirect to signed URL
        return NextResponse.redirect(signedUrl);

    } catch (error) {
        console.error("[RECEIPT_DOWNLOAD]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

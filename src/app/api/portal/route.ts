import { CustomerPortal } from "@polar-sh/nextjs";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export const GET = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'sandbox',
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`,
    getCustomerId: async (req: NextRequest) => {
        const { userId } = await auth();
        if (!userId) return "";

        const supabase = await createSupabaseServerClient();
        const { data: user } = await supabase
            .from('users')
            .select('polar_customer_id')
            .eq('clerk_id', userId)
            .single();

        return user?.polar_customer_id || "";
    },
});

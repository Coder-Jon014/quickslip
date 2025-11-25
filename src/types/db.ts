export type Tier = 'free' | 'pro';

export interface DbUser {
    id: string;               // uuid
    clerk_id: string;
    email: string | null;
    full_name: string | null;
    business_name: string | null;
    tier: Tier;
    stripe_customer_id: string | null;
    stripe_subscription_status: string | null;
    created_at: string;       // ISO timestamp
}

export type ReceiptStatus = 'draft' | 'sent' | 'paid';

export interface ReceiptItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface DbReceipt {
    id: string;               // uuid
    user_id: string;          // clerk_id
    receipt_number: string;
    client_name: string;
    client_email: string | null;
    client_id: string | null; // uuid
    items: ReceiptItem[];
    subtotal: number;         // changed to number as it's usually handled as number in frontend, though DB is decimal
    tax: number;
    total: number;
    payment_method: string | null;
    notes: string | null;
    status: ReceiptStatus;
    issued_date: string;      // ISO date
    pdf_url: string | null;   // new
    deleted_at: string | null; // new
    created_at: string;       // ISO timestamp
    updated_at: string;       // ISO timestamp
}

export interface DbClient {
    id: string;          // uuid
    user_id: string;     // clerk_id
    name: string;
    email: string | null;
    phone: string | null;
    created_at: string;  // ISO timestamp
    updated_at: string;  // ISO timestamp
}

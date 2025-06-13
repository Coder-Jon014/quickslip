# QuickSlip

QuickSlip is a modern digital receipt generator built with Next.js, shadcn/ui, and Supabase. Easily create, manage, and export professional receipts for your business or freelance work.

## Features

- Google OAuth authentication (Supabase Auth)
- User/company profile management
- Create, edit, and save receipts
- Add items, customer info, payment method, and due date
- Status tracking (Paid/Unpaid)
- PDF receipt generation and download
- Responsive, accessible UI with shadcn/ui
- Data stored securely in Supabase with RLS

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Supabase](https://supabase.com/) (database, auth, storage)
- [pdf-lib](https://pdf-lib.js.org/) (PDF generation)
- [nanoid](https://github.com/ai/nanoid) (unique reference numbers)

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd quickslip
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or yarn or pnpm
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key.
4. **Set up Supabase:**
   - Create a Supabase project and run the SQL in `/supabase/schema.sql` to set up tables and RLS policies.
   - Enable Google OAuth in Supabase Auth settings.
5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to use the app.

## Usage

1. **Sign in** with Google.
2. **Edit your company profile** (auto-created on first login).
3. **Create a new receipt:**
   - Fill in customer info, items, payment method, status, and due date.
   - Preview and download as PDF, or save to your dashboard.
4. **Manage receipts** from your dashboard.

## Deployment

Deploy on [Vercel](https://vercel.com/) or your preferred platform. Set environment variables for production Supabase credentials.

---

Made with ❤️ using Next.js, shadcn/ui, and Supabase.

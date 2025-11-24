# Quickslip - Digital Receipt Generator

A modern web application for freelancers to generate professional receipts, track income, and export financial summaries. Built with Next.js 14, Clerk, and Supabase.

## Features

- **Professional Receipts**: Generate and download PDF receipts.
- **Income Tracking**: Visual dashboard of weekly earnings.
- **Export Data**: Download financial data as CSV.
- **Secure Authentication**: Powered by Clerk.
- **Database**: Powered by Supabase.

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

**Clerk Keys:**
- Create a project at [dashboard.clerk.com](https://dashboard.clerk.com)
- Get your Publishable Key and Secret Key
- Add them to `.env.local`

**Supabase Keys:**
- Create a project at [supabase.com](https://supabase.com)
- Get your Project URL and Anon Key
- Add them to `.env.local`

### 2. Clerk & Supabase Integration

To allow the app to authenticate with Supabase using Clerk:

1. Go to **Clerk Dashboard** > **JWT Templates**.
2. Create a new template named `supabase`.
3. Set the "Claims" to include the default claims.
4. (Optional) You can customize the token contents if needed, but the default usually works if you map the user ID correctly.
   - **Important**: Ensure the `sub` claim maps to the user ID you expect in Supabase.

### 3. Database Setup

Run the SQL schema in your Supabase SQL Editor:

1. Copy the content of `supabase/schema.sql`.
2. Paste it into the SQL Editor in your Supabase dashboard.
3. Run the query to create tables and policies.

### 4. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and clients (Supabase, PDF)
- `supabase`: Database schema

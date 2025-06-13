# Digital Receipt Generator - Technical Requirements Document

## 1. Overview

The Digital Receipt Generator is a mobile-first web application built with Next.js and ShadCN UI. It allows freelancers and informal workers to generate professional PDF receipts, track weekly income, and export financial summaries.

This document outlines the detailed technical requirements, including system architecture, core features, modules, user flow, and feature tiering for free and paid users.

---

## 2. Technology Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes (with option to scale to tRPC or NestJS)
- **Database:** Supabase (as an alternative to Prisma/PostgreSQL)
- **Authentication:** NextAuth.js (email/password, optional magic link)
- **Storage:** Supabase Storage or AWS S3 for PDF files and logos
- **PDF Generation:** React-PDF or pdf-lib
- **Deployment:** Vercel (frontend/backend), optional Railway or Fly.io for backend
- **CI/CD:** GitHub Actions, Vercel built-in deployment

---

## 3. Core Features

### 3.1 Receipt Creation

- Fields: Customer Name, Date, Description, Amount, Logo (Pro only)
- Unique receipt reference number
- Generates branded PDF
- Includes QR code (available to all tiers)

### 3.2 User Dashboard

- View list of receipts with filters/search
- Weekly income summary with basic bar chart
- Export as CSV or PDF

### 3.3 PDF Customization

- Pro users can upload logos and set branding
- All users have receipts with QR codes

### 3.4 Export Features

- CSV and PDF export of income data
- Selectable date ranges

### 3.5 Offline Access

- Available only to paid tier
- PWA is not planned for now

### 3.6 Tier-based Access Control

| Feature              | Free Tier          | Paid Tier |
| -------------------- | ------------------ | --------- |
| Receipt Creation     | Limited (10/month) | Unlimited |
| QR Code in Receipt   | Yes                | Yes       |
| Edit/Delete Receipts | No                 | Yes       |
| Logo/Branding in PDF | No                 | Yes       |
| Offline Access       | No                 | Yes       |
| Email Confirmations  | No                 | No        |
| Scheduled Exports    | No                 | No        |

---

## 4. Authentication & Access Control

- NextAuth.js integration
- Role-based access via `tier` field in User model (`free` or `pro`)
- Middleware/API logic to enforce feature restrictions

---

## 5. Database Schema (Supabase Equivalent)

A similar structure will be used in Supabase:

**Users Table:**

- id (UUID)
- email
- name
- tier (free/pro)
- timestamps

**Receipts Table:**

- id (UUID)
- user\_id (FK)
- customer\_name
- service\_date
- description
- amount
- pdf\_url
- timestamps

---

## 6. Business Logic

### 6.1 Receipt Limit (Free Tier)

- At receipt creation, check number of receipts in last 30 days
- If over limit and tier is `free`, return error

### 6.2 Feature Flagging

- UI components and API actions conditionally rendered/enabled based on `user.tier`

### 6.3 File Storage Structure

- All user files stored in a shared bucket
- Folder structure:
  - `/[user_id]/logos/` – for uploaded brand/logo files
  - `/[user_id]/receipts/` – for generated PDF receipts

---

## 7. User Flow

### 7.1 Onboarding & Authentication

1. User lands on homepage
2. Chooses to sign up or log in via email/password
3. Post login, user is redirected to dashboard

### 7.2 Receipt Creation (Free or Pro)

1. User selects "Create New Receipt"
2. Fills in required details (Pro users can upload logo)
3. Clicks "Generate Receipt"
4. PDF is created, stored in `/[user_id]/receipts/` folder, and linked in database

### 7.3 Receipt Management

- Free Users: Can view and download previous receipts
- Pro Users: Can also edit and delete receipts

### 7.4 Dashboard Overview

- See list of all receipts
- Visual graph of weekly earnings
- Option to filter by date range

### 7.5 Export

- Select time range and download report as PDF or CSV

### 7.6 Upgrade to Pro

1. Click "Upgrade to Pro" button
2. Redirected to external Stripe portal
3. Upon success, user is redirected to dashboard and `tier` is updated

---

## 8. Folder Structure

```
/app
  /api
  /dashboard
  /auth
/components
/lib
/prisma (if using Prisma instead of Supabase)
/public
/styles
/utils
```

---

## 9. Testing Strategy

- Unit Tests: Form logic, receipt limit, auth logic
- E2E Tests: Playwright or Cypress for flow from login to PDF generation
- Validation: Zod and React Hook Form for field validation

---

## 10. Implementation Roadmap (Sprints)

### Sprint 1: Project Setup

- Next.js + Tailwind + ShadCN UI + Supabase
- Auth with NextAuth.js
- Basic user dashboard

### Sprint 2: Receipt Engine

- Receipt form UI and storage
- PDF generation and QR code
- Storage of PDF links in Supabase bucket

### Sprint 3: Data & Exports

- Weekly income summary
- Export CSV and PDF
- Bar chart display

### Sprint 4: Tier Management

- Add `tier` to user model
- Limit receipt creation
- Conditional feature rendering

### Sprint 5: Polish

- Responsive testing
- Logo uploads for pro users
- Manual tier upgrade (basic UI)

---

## 11. Open Questions (Resolved)

- Monthly receipt limit for free tier: **10**
- Subscription management: **Handled externally via Stripe portal**
- File structure: **All files stored in a single bucket under user-specific folders for logos and receipts**


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quickslip - Digital Receipt Generator",
  description: "Generate professional receipts, track income, and export summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#09090b',
          colorInputBackground: '#18181b',
          colorInputText: '#fff',
        }
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-black text-zinc-400 antialiased selection:bg-brand-500/30 selection:text-brand-200`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

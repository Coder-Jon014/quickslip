"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <Icon icon="solar:card-send-bold-duotone" className="text-brand-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-white font-semibold text-lg tracking-tight">Quickslip</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#" className="hover:text-white transition-colors">Product</Link>
                    <Link href="#" className="hover:text-white transition-colors">Solutions</Link>
                    <Link href="#" className="hover:text-white transition-colors">Company</Link>
                    <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="hidden sm:block text-sm font-medium hover:text-white transition-colors">Sign In</Link>
                    <Link href="/sign-up" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-medium transition-all">Get Started</Link>
                </div>
            </div>
        </nav>
    );
}

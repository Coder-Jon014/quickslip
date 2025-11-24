"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 pt-16 pb-8 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:card-send-bold-duotone" className="text-brand-400 text-xl" />
                        <span className="text-white font-semibold text-xl tracking-tight">Quickslip</span>
                    </div>

                    <div className="flex gap-4">
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-brand-400 hover:bg-brand-400 hover:text-black transition-all">
                            <Icon icon="solar:camera-linear" />
                        </Link>
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-brand-400 hover:bg-brand-400 hover:text-black transition-all">
                            <Icon icon="solar:bell-linear" />
                        </Link>
                        <Link href="#" className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-brand-400 hover:bg-brand-400 hover:text-black transition-all">
                            <Icon icon="simple-icons:x" className="text-sm" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm">Products</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Invoice Financing</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Payment Processing</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Risk Management</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Checkout API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm">Solutions</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Marketplaces</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">SaaS</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Enterprises</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm">Developers</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Guides</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-6 text-sm">Company</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Press</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>© 2025 Quickslip Flow. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-zinc-400 transition-colors">Terms and Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

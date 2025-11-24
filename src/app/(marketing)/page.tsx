"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="bg-black text-zinc-400 font-sans antialiased selection:bg-brand-500/30 selection:text-brand-200 min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Gradient Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-900/20 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
                                <Icon icon="solar:magic-stick-3-bold-duotone" className="text-brand-400 text-sm" />
                                <span className="text-xs font-medium tracking-wide uppercase text-zinc-300">Professional Receipts</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-6">
                                Generate professional receipts in <span className="text-brand-400">seconds.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg">
                                Create, track, and export professional receipts for your freelance business. Simple, fast, and free.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Link href="/sign-up" className="bg-brand-400 hover:bg-brand-300 text-black px-6 py-3.5 rounded-lg text-base font-medium transition-colors w-full sm:w-auto text-center">
                                    Get Started Now
                                </Link>
                                <button className="px-6 py-3.5 rounded-lg text-base font-medium text-white border border-zinc-800 hover:bg-zinc-900 transition-colors w-full sm:w-auto">
                                    View Demo
                                </button>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/50 group">
                            <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2969&auto=format&fit=crop" alt="Working woman" className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />

                            {/* Floating UI Card */}
                            <div className="absolute bottom-12 right-6 sm:right-12 bg-black border border-zinc-800 p-6 rounded-xl shadow-2xl w-72 sm:w-80 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                                            <Icon icon="solar:bill-check-bold-duotone" className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium text-sm">Receipt #4029</h3>
                                            <p className="text-xs text-zinc-500">Web Development</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium bg-brand-900/30 text-brand-400 px-2 py-1 rounded">Paid</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Date</span>
                                        <span className="text-white">Oct 24, 2025</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Amount</span>
                                        <span className="text-white">$2,400.00</span>
                                    </div>
                                    <div className="h-px bg-zinc-800 my-2"></div>
                                    <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <Icon icon="solar:download-minimalistic-bold-duotone" /> Download PDF
                                    </button>
                                </div>
                            </div>

                            {/* Floating Icons Left */}
                            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-brand-400 shadow-lg">
                                    <Icon icon="solar:wallet-money-bold-duotone" className="text-2xl" />
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-lg">
                                    <Icon icon="solar:chart-square-bold-duotone" className="text-2xl" />
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shadow-lg">
                                    <Icon icon="solar:shield-check-bold-duotone" className="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logos */}
                <section className="py-12 border-y border-white/5 bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-sm font-medium text-zinc-500 mb-8">Trusted by 100+ freelancers and agencies</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-50 hover:opacity-80 transition-opacity duration-300">
                            <Icon icon="logos:hubspot" className="h-8 w-auto" />
                            <Icon icon="simple-icons:dropbox" className="h-8 w-auto text-white" />
                            <Icon icon="simple-icons:square" className="h-8 w-auto text-white" />
                            <Icon icon="simple-icons:intercom" className="h-8 w-auto text-white" />
                            <Icon icon="logos:grammarly" className="h-8 w-auto" />
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-24 lg:py-32 relative">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">

                        {/* Sticky Left Content */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <h2 className="text-4xl font-medium text-white tracking-tight mb-6">
                                Everything you need to manage income.
                            </h2>
                            <p className="text-lg text-zinc-400 mb-8">
                                Stop using spreadsheets and messy templates. Switch to a professional workflow designed for modern freelancers.
                            </p>
                            <Link href="/sign-up" className="inline-flex items-center gap-2 text-brand-400 font-medium hover:text-brand-300 transition-colors">
                                Start for free <Icon icon="solar:arrow-right-up-bold-duotone" />
                            </Link>
                        </div>

                        {/* Right Cards */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1 */}
                            <div className="bg-amber-900/5 border border-amber-900/20 p-8 rounded-2xl hover:border-amber-900/40 transition-colors group">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                                    <Icon icon="solar:document-text-bold-duotone" className="text-amber-500 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-amber-100 mb-3 tracking-tight">Professional PDF Receipts</h3>
                                <p className="text-zinc-400 text-base leading-relaxed">
                                    Generate beautiful, itemized PDF receipts that look great on any device. Customize with your business details.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors group">
                                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-zinc-700 transition-colors">
                                    <Icon icon="solar:chart-2-bold-duotone" className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Weekly Income Tracking</h3>
                                <p className="text-zinc-400 text-base leading-relaxed">
                                    Visualize your earnings week by week. Know exactly how much you've made and stay on top of your goals.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-indigo-900/5 border border-indigo-900/20 p-8 rounded-2xl hover:border-indigo-900/40 transition-colors group">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                    <Icon icon="solar:export-bold-duotone" className="text-indigo-400 text-2xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-indigo-100 mb-3 tracking-tight">Easy Exports</h3>
                                <p className="text-zinc-400 text-base leading-relaxed">
                                    Export your financial data to CSV or PDF summaries for tax season or your accountant.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-12 px-6">
                    <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden h-[400px] flex items-center group">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" alt="Team" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                            <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tight mb-6">Create. Send. Done.</h2>
                            <p className="text-lg text-zinc-400 mb-8">Join thousands of freelancers using Quickslip to manage their receipts.</p>
                            <Link href="/sign-up" className="bg-brand-400 hover:bg-brand-300 text-black px-8 py-3 rounded-lg text-base font-medium transition-colors inline-block">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

"use client";
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
    return (
        <header className="h-16 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="md:hidden">
                {/* Mobile menu trigger would go here */}
                <span className="text-white font-semibold">Quickslip</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <UserButton />
            </div>
        </header>
    );
}

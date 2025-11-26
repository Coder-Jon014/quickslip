"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "solar:home-smile-bold-duotone" },
    { name: "Create Receipt", href: "/receipts/new", icon: "solar:document-add-bold-duotone" },
    { name: "My Receipts", href: "/receipts", icon: "solar:documents-bold-duotone" },
    { name: "Clients", href: "/clients", icon: "solar:users-group-rounded-bold-duotone" },
    { name: "Income Tracker", href: "/income", icon: "solar:chart-2-bold-duotone" },
    { name: "Export Data", href: "/export", icon: "solar:export-bold-duotone" },
    { name: "Settings", href: "/settings", icon: "solar:settings-bold-duotone" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-zinc-950 border-r border-zinc-900">
            <div className="flex items-center gap-2 h-16 px-6 border-b border-zinc-900">
                <Icon icon="solar:card-send-bold-duotone" className="text-brand-400 text-2xl" />
                <span className="text-white font-semibold text-lg tracking-tight">Quickslip</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-500/10 text-brand-400"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            )}
                        >
                            <Icon icon={item.icon} className="text-xl" />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-zinc-900">
                <div className="bg-zinc-900/50 rounded-lg p-4">
                    <h4 className="text-xs font-medium text-zinc-400 mb-2">Need help?</h4>
                    <p className="text-xs text-zinc-500 mb-3">Check our documentation or contact support.</p>
                    <button className="text-xs text-brand-400 hover:text-brand-300 font-medium">View Docs</button>
                </div>
            </div>
        </div>
    );
}

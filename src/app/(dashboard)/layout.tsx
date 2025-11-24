import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen">
                <DashboardHeader />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

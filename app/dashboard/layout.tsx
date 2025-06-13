import { ReactNode } from "react";
import DashboardLayoutShell from "@/components/ui/DashboardLayoutShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
} 
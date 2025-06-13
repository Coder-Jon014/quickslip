"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  Home,
  BarChart3,
  FileText,
  Bell,
  Search,
  Receipt,
  Plus,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "receipts", name: "Receipts", icon: Receipt, href: "/dashboard/receipts", badge: "12" },
  { id: "analytics", name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { id: "documents", name: "Documents", icon: FileText, href: "/dashboard/documents", badge: "3" },
  { id: "notifications", name: "Notifications", icon: Bell, href: "/dashboard/notifications", badge: "5" },
  { id: "profile", name: "Profile", icon: User, href: "/dashboard/profile" },
  { id: "settings", name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function DashboardHeader({ onMenuClick, isCollapsed }: { onMenuClick: () => void; isCollapsed: boolean }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search receipts..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button size="sm" className="gap-2" onClick={() => router.push('/dashboard/receipts')}>
          <Plus className="h-4 w-4" />
          Add Receipt
        </Button>
        
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function DashboardSidebar({ 
  isOpen, 
  isCollapsed, 
  activeItem, 
  onItemClick, 
  onToggleCollapse,
  onClose 
}: {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onToggleCollapse: () => void;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleSidebarItemClick = (item: NavigationItem) => {
    onItemClick(item.id);
    if (item.href) {
      router.push(item.href);
    }
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0 md:relative md:z-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Receipt className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">ReceiptManager</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Receipt className="h-4 w-4 text-primary-foreground" />
            </div>
          )}

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden md:flex h-8 w-8"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => handleSidebarItemClick(item)}
                    className={`
                      w-full justify-start h-10 transition-all duration-200 group relative
                      ${isCollapsed ? "px-2" : "px-3"}
                    `}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full ml-3">
                        <span className="text-sm">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <span className="text-xs font-medium">
                          {parseInt(item.badge) > 9 ? '9+' : item.badge}
                        </span>
                      </div>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="mt-auto border-t border-border">
          <div className={`p-3 ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed ? (
              <div className="flex items-center p-3 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">Administrator</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="p-3">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`
                w-full text-destructive hover:text-destructive hover:bg-destructive/10
                ${isCollapsed ? "px-2" : "justify-start"}
              `}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardMain() {
  const router = useRouter();
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your receipts and track expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => router.push('/dashboard/receipts')}>
            <Plus className="h-4 w-4 mr-2" />
            New Receipt
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 urgent items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Receipts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
          <CardDescription>Your latest receipt uploads and submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Receipt #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Grocery Store - Food & Beverages</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 100 + 10).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function DashboardLayoutShell({ children, className = "" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      <DashboardSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isCollapsed={sidebarCollapsed}
        />
        {/* Render children if present, otherwise show the dashboard main */}
        {children && React.Children.count(children) > 0 ? children : <DashboardMain />}
      </div>
    </div>
  );
} 
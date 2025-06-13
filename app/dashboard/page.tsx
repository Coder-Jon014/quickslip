"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Filter, Plus, Receipt, BarChart3, Bell, FileText } from "lucide-react";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const router = useRouter();

  const getUserAndEnsureProfile = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data?.user || null;
    setUser(user);
    setLoading(false);
    if (user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!profile) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            // Add other fields as needed
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getUserAndEnsureProfile();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user) return;
      setReceiptsLoading(true);
      const { data, error } = await supabase
        .from("receipts")
        .select("id, customer_name, service_date, description, amount, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setReceipts(data || []);
      setReceiptsLoading(false);
    };
    if (user) fetchReceipts();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return null; // Optionally, show nothing while redirecting
  }

  // Prefer display name, fallback to email
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Welcome, {displayName}!</h2>
      </div>
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
          <Button size="sm">
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
          {receiptsLoading ? (
            <div>Loading receipts...</div>
          ) : receipts.length === 0 ? (
            <div>No receipts found.</div>
          ) : (
            <div className="space-y-4">
              {receipts.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{r.customer_name || "(No Name)"}</p>
                      <p className="text-sm text-muted-foreground">{r.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${r.amount?.toFixed(2) ?? "0.00"}</p>
                    <p className="text-sm text-muted-foreground">{r.service_date || r.created_at?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
} 
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Download, Mail, MapPin, Phone, Calendar, CreditCard, PlusCircle, Trash2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "@/lib/supabaseClient";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface ReceiptItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ReceiptData {
  reference: string;
  date: string;
  due_date: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "Paid" | "Unpaid";
}

interface ReceiptPageProps {
  receiptData?: ReceiptData;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

const ReceiptPage = ({
  receiptData: initialReceiptData = {
    reference: "RCP-2024-001",
    date: "2024-01-15",
    due_date: "2024-01-22",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerAddress: "123 Main Street, City, State 12345",
    items: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "Noise-cancelling, Bluetooth 5.0",
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99
      },
      {
        id: "2",
        name: "USB-C Cable",
        description: "3ft, Fast charging",
        quantity: 2,
        unitPrice: 19.99,
        total: 39.98
      },
      {
        id: "3",
        name: "Phone Case",
        description: "Clear protective case",
        quantity: 1,
        unitPrice: 24.99,
        total: 24.99
      }
    ],
    subtotal: 364.96,
    tax: 36.50,
    discount: 20.00,
    total: 381.46,
    paymentMethod: "Credit Card",
    status: "Paid"
  },
  companyName: initialCompanyName = "",
  companyAddress: initialCompanyAddress = "",
  companyPhone: initialCompanyPhone = "",
  companyEmail: initialCompanyEmail = ""
}: ReceiptPageProps) => {
  const [receiptData, setReceiptData] = React.useState<ReceiptData>(initialReceiptData);
  const [companyName, setCompanyName] = React.useState(initialCompanyName);
  const [companyAddress, setCompanyAddress] = React.useState(initialCompanyAddress);
  const [companyPhone, setCompanyPhone] = React.useState(initialCompanyPhone);
  const [companyEmail, setCompanyEmail] = React.useState(initialCompanyEmail);
  const [pdfGenerating, setPdfGenerating] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileExists, setProfileExists] = React.useState(false);
  const userIdRef = React.useRef<string | null>(null);

  // Fetch user profile and pre-fill company info
  React.useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setProfileLoading(false);
        return;
      }
      const user = userData.user;
      userIdRef.current = user.id;
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("company_name, company_email, company_phone, company_address")
        .eq("id", user.id)
        .single();
      if (profile && !profileError) {
        setCompanyName(profile.company_name || "");
        setCompanyEmail(profile.company_email || user.email || "");
        setCompanyPhone(profile.company_phone || "");
        setCompanyAddress(profile.company_address || "");
        setProfileExists(true);
      } else {
        // No profile: prefill from auth
        setCompanyName(user.user_metadata?.full_name || user.email || "");
        setCompanyEmail(user.email || "");
        setCompanyPhone("");
        setCompanyAddress("");
        setProfileExists(false);
      }
      setProfileLoading(false);
    };
    fetchProfile();
  }, []);

  // Auto-create profile if user edits company info and no profile exists
  React.useEffect(() => {
    if (!profileLoading && !profileExists && userIdRef.current) {
      // Only create if any company field is non-empty
      if (companyName || companyEmail || companyPhone || companyAddress) {
        supabase.from("profiles").upsert([
          {
            id: userIdRef.current,
            company_name: companyName,
            company_email: companyEmail,
            company_phone: companyPhone,
            company_address: companyAddress,
          }
        ]);
        setProfileExists(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, companyEmail, companyPhone, companyAddress, profileLoading]);

  React.useEffect(() => {
    const calculateTotals = () => {
      let newSubtotal = 0;
      receiptData.items.forEach(item => {
        newSubtotal += item.quantity * item.unitPrice;
      });

      const newTax = newSubtotal * 0.10; // Example 10% tax
      const newTotal = newSubtotal + newTax - receiptData.discount;

      setReceiptData(prev => ({
        ...prev,
        subtotal: parseFloat(newSubtotal.toFixed(2)),
        tax: parseFloat(newTax.toFixed(2)),
        total: parseFloat(newTotal.toFixed(2)),
      }));
    };
    calculateTotals();
  }, [receiptData.items, receiptData.discount]);

  const handleDownload = async () => {
    setPdfGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let y = 800;
      // Company Name
      page.drawText(companyName, { x: 50, y, size: 18, font, color: rgb(0,0,0) });
      y -= 20;
      // Company Info
      page.drawText(companyAddress, { x: 50, y, size: 10, font });
      y -= 14;
      page.drawText(companyPhone, { x: 50, y, size: 10, font });
      y -= 14;
      page.drawText(companyEmail, { x: 50, y, size: 10, font });
      y -= 24;
      // Receipt Number & Date
      page.drawText(`Receipt #: ${receiptData.reference}`, { x: 50, y, size: 12, font });
      page.drawText(`Date: ${receiptData.date}`, { x: 300, y, size: 12, font });
      y -= 20;
      // Status & Payment Method
      page.drawText(`Status: ${receiptData.status}`, { x: 50, y, size: 10, font });
      page.drawText(`Payment: ${receiptData.paymentMethod}`, { x: 300, y, size: 10, font });
      y -= 20;
      // Customer Info
      page.drawText("Bill To:", { x: 50, y, size: 12, font });
      page.drawText(receiptData.customerName, { x: 70, y, size: 10, font });
      y -= 12;
      page.drawText(receiptData.customerEmail, { x: 70, y, size: 10, font });
      y -= 12;
      page.drawText(receiptData.customerAddress, { x: 70, y, size: 10, font });
      y -= 20;
      // Items Table Header
      page.drawText("Item", { x: 50, y, size: 10, font });
      page.drawText("Qty", { x: 250, y, size: 10, font });
      page.drawText("Unit Price", { x: 320, y, size: 10, font });
      page.drawText("Total", { x: 420, y, size: 10, font });
      y -= 12;
      // Items
      receiptData.items.forEach((item) => {
        page.drawText(item.name, { x: 50, y, size: 10, font });
        page.drawText(String(item.quantity), { x: 250, y, size: 10, font });
        page.drawText(`$${item.unitPrice.toFixed(2)}`, { x: 320, y, size: 10, font });
        page.drawText(`$${item.total.toFixed(2)}`, { x: 420, y, size: 10, font });
        y -= 12;
        if (item.description) {
          page.drawText(item.description, { x: 60, y, size: 8, font, color: rgb(0.4,0.4,0.4) });
          y -= 10;
        }
      });
      y -= 10;
      // Totals
      page.drawText(`Subtotal: $${receiptData.subtotal.toFixed(2)}`, { x: 320, y, size: 10, font });
      y -= 12;
      page.drawText(`Tax: $${receiptData.tax.toFixed(2)}`, { x: 320, y, size: 10, font });
      y -= 12;
      if (receiptData.discount > 0) {
        page.drawText(`Discount: -$${receiptData.discount.toFixed(2)}`, { x: 320, y, size: 10, font });
        y -= 12;
      }
      page.drawText(`Total: $${receiptData.total.toFixed(2)}`, { x: 320, y, size: 12, font });
      y -= 24;
      // Footer
      page.drawText("Thank you for your business!", { x: 50, y, size: 10, font });
      page.drawText(`For questions, contact us at ${companyEmail}`, { x: 50, y: y-12, size: 10, font });
      // Download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${receiptData.reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      alert("Failed to generate PDF: " + (err instanceof Error ? err.message : String(err)));
    }
    setPdfGenerating(false);
  };

  const handleEmailReceipt = () => {
    const subject = `Receipt ${receiptData.reference}`;
    const body = `Thank you for your purchase! Your receipt number is ${receiptData.reference}.`;
    window.open(`mailto:${receiptData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: any) => {
    const newItems = [...receiptData.items];
    const item = newItems[index];

    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        item[field] = numValue;
        item.total = item.quantity * item.unitPrice;
      } else if (value === '') { // Allow clearing input
        item[field] = 0;
        item.total = 0;
      }
    } else {
      item[field] = value;
    }
    setReceiptData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setReceiptData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: String(Date.now()), name: "", description: "", quantity: 1, unitPrice: 0, total: 0 }
      ]
    }));
  };

  const handleRemoveItem = (id: string) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSaveReceipt = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setSaveMessage("Could not get user info. Please log in again.");
        setSaving(false);
        return;
      }
      const user = userData.user;
      // Compose receipt data for Supabase (no company fields)
      const receiptToSave = {
        user_id: user.id,
        reference: receiptData.reference,
        service_date: receiptData.date,
        due_date: receiptData.due_date,
        customer_name: receiptData.customerName,
        customer_email: receiptData.customerEmail,
        customer_address: receiptData.customerAddress,
        items: receiptData.items,
        subtotal: receiptData.subtotal,
        tax: receiptData.tax,
        discount: receiptData.discount,
        total: receiptData.total,
        payment_method: receiptData.paymentMethod,
        status: receiptData.status,
      };
      const { error } = await supabase.from("receipts").insert([receiptToSave]);
      if (error) {
        setSaveMessage("Error saving receipt: " + error.message);
      } else {
        setSaveMessage("Receipt saved successfully!");
      }
    } catch (err: unknown) {
      setSaveMessage("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receipt Generator</h1>
            <p className="text-muted-foreground">Edit details to generate your receipt</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEmailReceipt} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Receipt
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2" disabled={pdfGenerating}>
              <Download className="h-4 w-4" />
              {pdfGenerating ? "Generating..." : "Download"}
            </Button>
            <Button onClick={handleSaveReceipt} className="flex items-center gap-2" disabled={saving}>
              {saving ? "Saving..." : "Save Receipt"}
            </Button>
          </div>
        </div>

        {/* Receipt Card */}
        <Card className="w-full">
          <CardHeader className="space-y-6">
            {/* Company Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="companyName" className="mb-1">Company Name</Label>
                <Input id="companyName" value={companyName ?? ""} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyAddress" className="mb-1">Company Address</Label>
                <Input id="companyAddress" value={companyAddress ?? ""} onChange={(e) => setCompanyAddress(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyPhone" className="mb-1">Company Phone</Label>
                <Input id="companyPhone" value={companyPhone ?? ""} onChange={(e) => setCompanyPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="companyEmail" className="mb-1">Company Email</Label>
                <Input id="companyEmail" value={companyEmail ?? ""} onChange={(e) => setCompanyEmail(e.target.value)} />
              </div>
            </div>

            <Separator />

            {/* Receipt Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="receiptNumber" className="mb-1">Receipt Number</Label>
                <Input id="receiptNumber" value={receiptData.reference ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, reference: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="receiptDate" className="mb-1">Date</Label>
                <Input id="receiptDate" type="date" value={receiptData.date ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="dueDate" className="mb-1">Due Date</Label>
                <Input id="dueDate" type="date" value={receiptData.due_date ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, due_date: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="receiptStatus" className="mb-1">Status</Label>
                <Select value={receiptData.status ?? "Paid"} onValueChange={(value: "Paid" | "Unpaid") => setReceiptData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger id="receiptStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentMethod" className="mb-1">Payment Method</Label>
                <Select value={receiptData.paymentMethod ?? ""} onValueChange={(value: string) => setReceiptData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Bill To:</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="customerName" className="mb-1">Customer Name</Label>
                  <Input id="customerName" value={receiptData.customerName ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, customerName: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="customerEmail" className="mb-1">Customer Email</Label>
                  <Input id="customerEmail" type="email" value={receiptData.customerEmail ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, customerEmail: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="customerAddress" className="mb-1">Customer Address</Label>
                  <Textarea id="customerAddress" value={receiptData.customerAddress ?? ""} onChange={(e) => setReceiptData(prev => ({ ...prev, customerAddress: e.target.value }))} />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Items Table */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                      <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Qty</th>
                      <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Unit Price</th>
                      <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                      <th className="pb-3 text-right text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {receiptData.items.map((item, index) => (
                      <tr key={item.id} className={index !== receiptData.items.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="py-3">
                          <Input
                            value={item.name ?? ""}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            placeholder="Item Name"
                            className="mb-1"
                          />
                          <Input
                            value={item.description ?? ""}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Description (optional)"
                            className="text-sm text-muted-foreground"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Input
                            type="number"
                            value={item.quantity ?? 0}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-20 text-center"
                            min="0"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <Input
                            type="number"
                            value={item.unitPrice ?? 0}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                            className="w-24 text-right"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="py-3 text-right font-medium text-foreground">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full" onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${receiptData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (Calculated)</span>
                <span className="text-foreground">${receiptData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <Label htmlFor="discount" className="text-muted-foreground">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={receiptData.discount ?? 0}
                  onChange={(e) => setReceiptData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="w-24 text-right"
                  step="0.01"
                  min="0"
                />
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${receiptData.total.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            {/* Preview Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Receipt Preview</h2>
              <Card className="w-full border-2 border-dashed border-primary/50 p-4">
                <CardHeader className="space-y-6 p-0">
                  {/* Company Info */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{companyName ?? ""}</h2>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {companyAddress ?? ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {companyPhone ?? ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {companyEmail ?? ""}
                        </div>
                      </div>
                    </div>

                    {/* Receipt Status */}
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <Badge className={cn("capitalize", getStatusColor(receiptData.status ?? "Paid"))}>
                        {receiptData.status === "Paid" && <Check className="mr-1 h-3 w-3" />}
                        {receiptData.status ?? "Paid"}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(receiptData.date ?? "").toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Due: {receiptData.due_date ? new Date(receiptData.due_date).toLocaleDateString() : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">Bill To:</h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-foreground">{receiptData.customerName ?? ""}</p>
                      <p className="text-muted-foreground">{receiptData.customerEmail ?? ""}</p>
                      <p className="text-muted-foreground">{receiptData.customerAddress ?? ""}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-0 pt-6">
                  {/* Items Table */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                            <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Qty</th>
                            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Unit Price</th>
                            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          {receiptData.items.map((item, index) => (
                            <tr key={item.id} className={index !== receiptData.items.length - 1 ? "border-b border-border/50" : ""}>
                              <td className="py-3">
                                <div>
                                  <p className="font-medium text-foreground">{item.name ?? ""}</p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 text-center text-foreground">{item.quantity ?? 0}</td>
                              <td className="py-3 text-right text-foreground">${(item.unitPrice ?? 0).toFixed(2)}</td>
                              <td className="py-3 text-right font-medium text-foreground">${(item.total ?? 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${receiptData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">${receiptData.tax.toFixed(2)}</span>
                    </div>
                    {receiptData.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-green-600">-${receiptData.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">${receiptData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Info */}
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium text-foreground">{receiptData.paymentMethod ?? ""}</span>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>Thank you for your business!</p>
                    <p className="mt-1">For questions about this receipt, contact us at {companyEmail ?? ""}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {saveMessage && (
          <div className="mt-4 text-center text-sm text-muted-foreground">{saveMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ReceiptPage; 
"use client";

import { useState } from "react";
import { updateUpiSettings } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  plan_name: string;
  amount: number;
  utr: string;
  created_at: string;
  profiles: { name: string; username: string } | null;
};

export function AdminPaymentManager({ transactions, username, currentUpiId, currentUpiName }: { transactions: Transaction[]; username: string; currentUpiId?: string; currentUpiName?: string }) {
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState(currentUpiId || "");
  const [upiName, setUpiName] = useState(currentUpiName || "");

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUpiSettings(upiId, upiName, username);
      alert("UPI Settings saved successfully!");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>UPI Configuration</CardTitle>
          <CardDescription>Configure the UPI ID where users will send their subscription payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 max-w-sm">
            <div className="flex flex-col gap-2">
              <Label>UPI ID (VPA)</Label>
              <Input 
                value={upiId} 
                onChange={e => setUpiId(e.target.value)} 
                placeholder="e.g. admin@okaxis" 
                required 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Payee Name</Label>
              <Input 
                value={upiName} 
                onChange={e => setUpiName(e.target.value)} 
                placeholder="e.g. Sinegol Rewards" 
                required 
              />
            </div>
            <Button type="submit" disabled={loading} className="w-fit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions recorded yet.</p>
        ) : (
          <div className="grid gap-4">
            {transactions.map(tx => (
              <Card key={tx.id}>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{tx.profiles?.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">@{tx.profiles?.username} &bull; {new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">₹{tx.amount}</p>
                      <Badge variant="default" className="mt-1">Completed</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-0 pb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{tx.plan_name}</span>
                    <span className="text-muted-foreground ml-4">UTR:</span>
                    <code className="bg-muted px-2 py-0.5 rounded text-xs">{tx.utr}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

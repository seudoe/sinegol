"use client";

import { useState } from "react";
import { submitPayment } from "@/app/actions/payment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";

export function PlanSubscriber({ planName, price, currentPlan, username, upiId, upiName, hasActivePlan }: { planName: string; price: number; currentPlan?: string; username: string; upiId?: string; upiName?: string; hasActivePlan?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [utr, setUtr] = useState("");
  
  const isCurrent = currentPlan === planName;
  const upiString = `upi://pay?pa=${upiId || 'demo@upi'}&pn=${encodeURIComponent(upiName || 'Sinegol')}&am=${price}&cu=INR`;

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!utr || utr.length < 6) return alert("Please enter a valid Transaction ID / UTR");
    
    setLoading(true);
    try {
      await submitPayment(planName, price, utr, username);
      setIsOpen(false);
      alert("Payment successful! Your subscription is now active.");
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  if (isCurrent && hasActivePlan) {
    return <Button disabled variant="secondary" className="w-full">Current Plan</Button>;
  }
  
  if (hasActivePlan) {
    return <Button disabled variant="outline" className="w-full">You have an active plan</Button>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
        Select Plan
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to pay <b>₹{price}</b> for the <b>{planName}</b> plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border mt-2">
          {upiId ? (
            <>
              <QRCodeSVG value={upiString} size={200} />
              <p className="mt-4 text-sm font-medium text-black">{upiId}</p>
            </>
          ) : (
            <p className="text-red-500 text-sm text-center">UPI not configured by Admin.</p>
          )}
        </div>

        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="utr">Transaction ID / UTR</Label>
            <Input 
              id="utr" 
              value={utr} 
              onChange={e => setUtr(e.target.value)} 
              placeholder="e.g. 123456789012" 
              required
            />
            <p className="text-xs text-muted-foreground">Enter the 12-digit reference number after your payment is successful.</p>
          </div>
          <Button type="submit" disabled={loading || !upiId}>
            {loading ? "Verifying..." : "I have paid"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

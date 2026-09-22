"use client";

import { useState } from "react";
import { createPlan, updatePlan, deletePlan, recoverPlan } from "@/app/actions/plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_interval: string;
  deleted_at: string | null;
};

export function AdminPlanManager({ plans, username }: { plans: Plan[]; username: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("monthly");

  function openCreate() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setInterval("monthly");
    setIsOpen(true);
  }

  function openEdit(p: Plan) {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(p.price.toString());
    setInterval(p.billing_interval);
    setIsOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updatePlan(editingId, name, description, Number(price), interval, username);
      } else {
        await createPlan(name, description, Number(price), interval, username);
      }
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  async function handleToggleStatus(id: string, isDeleted: boolean) {
    if (loading) return;
    setLoading(true);
    try {
      if (isDeleted) {
        await recoverPlan(id, username);
      } else {
        if (confirm("Are you sure you want to soft-delete this plan? Users currently on this plan will not be affected, but new users won't be able to select it.")) {
          await deletePlan(id, username);
        }
      }
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">Platform Plans</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onClick={openCreate}>
            Create Plan
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Plan" : "Create Plan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Label>Plan Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Premium" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Billing Interval</Label>
                  <select 
                    value={interval} 
                    onChange={e => setInterval(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="mt-2">Save Plan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">No plans created yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map(p => {
            const isDeleted = !!p.deleted_at;
            return (
              <Card key={p.id} className={isDeleted ? 'opacity-70 grayscale' : ''}>
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {p.name}
                        {isDeleted && <Badge variant="destructive" className="text-[10px]">Deleted</Badge>}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{p.price}</p>
                      <p className="text-xs text-muted-foreground capitalize">/{p.billing_interval}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)} disabled={loading}>
                    Edit
                  </Button>
                  <Button 
                    variant={isDeleted ? "secondary" : "destructive"} 
                    size="sm" 
                    onClick={() => handleToggleStatus(p.id, isDeleted)}
                    disabled={loading}
                  >
                    {isDeleted ? "Recover" : "Delete"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

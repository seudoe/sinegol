"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserCharity } from "@/app/actions/charity";

type Charity = { id: string; name: string; description: string };

export function CharityPicker({
  charities,
  username,
  initialSelection
}: {
  charities: Charity[];
  username: string;
  initialSelection?: { charity_id: string; percentage: number };
}) {
  const [selectedId, setSelectedId] = useState<string>(initialSelection?.charity_id || "");
  const [percentage, setPercentage] = useState<number>(initialSelection?.percentage || 10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) {
      setError("Please select a charity.");
      return;
    }
    setLoading(true);
    setError(null);
    
    const res = await setUserCharity(selectedId, percentage, username);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {charities.length === 0 ? (
          <p className="text-muted-foreground text-sm col-span-2">No charities available yet.</p>
        ) : (
          charities.map(charity => (
            <div
              key={charity.id}
              className={`border p-4 rounded-lg cursor-pointer transition-colors ${selectedId === charity.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
              onClick={() => setSelectedId(charity.id)}
            >
              <h3 className="font-medium mb-1">{charity.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{charity.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <Label htmlFor="percentage">Contribution Percentage (%)</Label>
        <Input
          id="percentage"
          type="number"
          min="1"
          max="100"
          value={percentage}
          onChange={e => setPercentage(Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">How much of your potential winnings goes to charity?</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading || charities.length === 0} className="w-fit">
        Save Selection
      </Button>
    </form>
  );
}

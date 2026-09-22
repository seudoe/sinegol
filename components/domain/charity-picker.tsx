"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserCharity } from "@/app/actions/charity";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { CharityInfoDialog } from "@/components/domain/charity-info-dialog";

type Charity = { id: string; name: string; description: string; image_url?: string | null };

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
    if (percentage < 10) {
      setError("Minimum contribution is 10%.");
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
          charities.map(charity => {
            const isCurrentSaved = initialSelection?.charity_id === charity.id;
            const isSelectedToSave = selectedId === charity.id;
            
            return (
              <div
                key={charity.id}
                className={`relative border rounded-lg cursor-pointer transition-colors flex flex-col overflow-hidden ${isSelectedToSave ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50'}`}
                onClick={() => setSelectedId(charity.id)}
              >
                {charity.image_url ? (
                  <div className="w-full h-32 bg-muted relative">
                    <img src={charity.image_url} alt={charity.name} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-full h-2 bg-muted" />
                )}
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium pr-6">{charity.name}</h3>
                  {isSelectedToSave && (
                    <CheckCircle2 className="h-5 w-5 text-primary absolute top-4 right-4" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-2">{charity.description}</p>
                
                <div className="mt-2 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                  <CharityInfoDialog charity={charity} />
                  {isCurrentSaved && (
                    <Badge variant="secondary" className="text-xs">
                      Current ({initialSelection.percentage}%)
                    </Badge>
                  )}
                </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <Label htmlFor="percentage">Contribution Percentage (%)</Label>
        <Input
          id="percentage"
          type="number"
          min="10"
          max="100"
          value={percentage}
          onChange={e => setPercentage(Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">Minimum 10%. How much of your potential winnings goes to charity?</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading || charities.length === 0} className="w-fit">
        Save Selection
      </Button>
    </form>
  );
}

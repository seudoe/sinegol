"use client";

import { useState } from "react";
import { simulateDraw, publishDraw } from "@/app/actions/draw";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SimulationResult = {
  numbers: number[];
  prizes: { 3: number; 4: number; 5: number };
  winnerCounts: { 3: number; 4: number; 5: number };
};

export function DrawManager({ username }: { username: string }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [method, setMethod] = useState<"random" | "algorithmic">("random");
  const [prizePool, setPrizePool] = useState<number>(1000);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSimulation(null);
    
    try {
      const res = await simulateDraw(method, prizePool, username);
      setSimulation(res);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setLoading(false);
  }

  async function handlePublish() {
    if (!simulation) return;
    setLoading(true);
    setError(null);
    
    try {
      await publishDraw(month, method, prizePool, simulation.numbers, username);
      alert("Draw published successfully!");
      setSimulation(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Monthly Draw</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimulate} className="flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="month">Month (YYYY-MM)</Label>
                <Input
                  id="month"
                  type="month"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="prize">Prize Pool ($)</Label>
                <Input
                  id="prize"
                  type="number"
                  min="1"
                  value={prizePool}
                  onChange={e => setPrizePool(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Draw Method</Label>
              <Select value={method} onValueChange={(v: "random" | "algorithmic" | null) => { if(v) setMethod(v); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random Engine</SelectItem>
                  <SelectItem value="algorithmic">Algorithmic Engine</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Algorithmic engine uses active users&apos; scores to ensure a minimum mathematical overlap.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <Button type="submit" disabled={loading} variant="secondary">
              {loading ? "Simulating..." : "Simulate Draw"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {simulation && (
        <Card className="border-primary ring-1 ring-primary">
          <CardHeader>
            <CardTitle className="text-primary">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <Label className="mb-2 block">Drawn Numbers</Label>
              <div className="flex gap-2">
                {simulation.numbers.map((n, i) => (
                  <Badge key={i} className="text-lg py-1 px-3" variant="outline">
                    {n}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-muted-foreground text-sm">3 Matches (25%)</p>
                <p className="text-2xl font-semibold mt-1">{simulation.winnerCounts[3]} winners</p>
                <p className="text-sm text-green-600 mt-1">${simulation.prizes[3].toFixed(2)} each</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-muted-foreground text-sm">4 Matches (35%)</p>
                <p className="text-2xl font-semibold mt-1">{simulation.winnerCounts[4]} winners</p>
                <p className="text-sm text-green-600 mt-1">${simulation.prizes[4].toFixed(2)} each</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Jackpot (40%)</p>
                <p className="text-2xl font-semibold mt-1">{simulation.winnerCounts[5]} winners</p>
                <p className="text-sm text-green-600 mt-1">${simulation.prizes[5].toFixed(2)} each</p>
              </div>
            </div>

            <Button onClick={handlePublish} disabled={loading} className="w-full">
              Publish & Finalize Draw
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

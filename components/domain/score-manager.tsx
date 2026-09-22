"use client";

import { useState } from "react";
import { addScore, deleteScore } from "@/app/actions/score";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2Icon, PencilIcon } from "lucide-react";

type Score = { id: string; score: number; played_date: string };

export function ScoreManager({ scores, username }: { scores: Score[]; username: string }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [score, setScore] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || score === "" || score < 1 || score > 45) {
      setError("Please enter a valid date and a score between 1 and 45.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const res = await addScore(score as number, date, username);
    if (res?.error) {
      setError(res.error);
    } else {
      setScore("");
    }
    setLoading(false);
  }
  
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this score?")) return;
    await deleteScore(id, username);
  }

  function handleEdit(s: Score) {
    setDate(s.played_date);
    setScore(s.score);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="font-medium text-lg">Add or Edit Score</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Played Date</Label>
                <Input
                  id="date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="score">Score (1-45)</Label>
                <Input
                  id="score"
                  type="number"
                  min="1"
                  max="45"
                  value={score}
                  onChange={e => setScore(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">Adding a 6th score will automatically remove your oldest score.</p>
            <Button type="submit" disabled={loading} className="w-fit mt-2">
              Save Score
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-lg">Your Recent Scores ({scores.length}/5)</h3>
        {scores.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven&apos;t added any scores yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {scores.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <p className="font-medium text-xl">{s.score} pts</p>
                  <p className="text-sm text-muted-foreground">{new Date(s.played_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(s)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

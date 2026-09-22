"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrophyIcon } from "lucide-react";

type LeaderboardEntry = {
  username: string;
  totalWon: number;
};

export function LeaderboardDialog({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-sm">
        <TrophyIcon className="w-4 h-4 mr-2" /> Winnings of other people
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Community Leaderboard</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          {leaderboard.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No winnings recorded yet.</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.username} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="font-medium">@{entry.username}</p>
                </div>
                <p className="font-semibold text-green-600">${entry.totalWon.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { submitProof } from "@/app/actions/winner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProofSubmitter({ winnerId, username }: { winnerId: string; username: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    
    try {
      await submitProof(winnerId, url, username);
      alert("Proof submitted successfully!");
    } catch (err) {
      if (err instanceof Error) alert("Error: " + err.message);
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4 pt-4 border-t">
      <p className="text-sm font-medium">Submit Proof of Score</p>
      <p className="text-xs text-muted-foreground mb-2">Please provide a URL to a photo of your scorecard or digital app screenshot to verify your win.</p>
      <div className="flex gap-2">
        <Input 
          type="url" 
          placeholder="https://imgur.com/..." 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          required 
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>Submit</Button>
      </div>
    </form>
  );
}

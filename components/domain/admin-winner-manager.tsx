"use client";

import { useState } from "react";
import { reviewProof, markPaid } from "@/app/actions/winner";
import { Button } from "@/components/ui/button";

export function AdminWinnerManager({ winnerId, username, proofUrl, verificationStatus, payoutStatus }: { winnerId: string; username: string; proofUrl: string | null; verificationStatus: string; payoutStatus: string }) {
  const [loading, setLoading] = useState(false);

  async function handleReview(status: "approved" | "rejected") {
    setLoading(true);
    try {
      await reviewProof(winnerId, status, username);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  async function handleMarkPaid() {
    setLoading(true);
    try {
      await markPaid(winnerId, username);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
      {proofUrl && verificationStatus === 'pending' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Review Proof</p>
          <a href={proofUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mb-2 truncate">
            View Submitted Proof
          </a>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleReview('approved')} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Approve</Button>
            <Button size="sm" variant="destructive" onClick={() => handleReview('rejected')} disabled={loading} className="flex-1">Reject</Button>
          </div>
        </div>
      )}

      {verificationStatus === 'approved' && payoutStatus === 'pending' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-green-600">Proof Approved</p>
          <Button size="sm" onClick={handleMarkPaid} disabled={loading} className="w-full">
            Mark as Paid
          </Button>
        </div>
      )}

      {payoutStatus === 'paid' && (
        <p className="text-sm font-medium text-green-600 text-center py-2 bg-green-50 rounded">Fully Processed & Paid</p>
      )}
    </div>
  );
}

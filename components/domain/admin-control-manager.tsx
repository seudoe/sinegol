"use client";

import { useState } from "react";
import { approveAdmin, deleteAdmin } from "@/app/actions/admin-control";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminHierarchyGraph } from "@/components/domain/admin-hierarchy-graph";

type AdminProfile = {
  id: string;
  name: string;
  username: string;
  admin_status: "pending" | "approved";
  admin_depth: number;
  approved_by: string | null;
  approver?: { name: string } | null;
};

export function AdminControlManager({ admins, currentUserId, currentUserDepth, username }: { admins: AdminProfile[]; currentUserId: string; currentUserDepth: number; username: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendingAdmins = admins.filter(a => a.admin_status === "pending");
  const allApprovedAdmins = admins.filter(a => a.admin_status === "approved");
  const approvedAdmins = allApprovedAdmins.filter(a => a.id !== currentUserId);

  async function handleApprove(id: string) {
    setLoadingId(id);
    try {
      await approveAdmin(id, username);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoadingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this admin? This will also permanently remove ANY admins that they approved!")) return;
    
    setLoadingId(id);
    try {
      await deleteAdmin(id, username);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    setLoadingId(null);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Pending Approvals ({pendingAdmins.length})</h2>
        {pendingAdmins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending admin applications.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingAdmins.map(a => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{a.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">@{a.username}</p>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleApprove(a.id)} disabled={loadingId === a.id}>
                    Approve Application
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Active Administrators</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {approvedAdmins.map(a => {
            const canManage = (a.admin_depth || 0) > currentUserDepth;
            return (
              <Card key={a.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{a.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">@{a.username}</p>
                      <Badge variant="outline">Depth Level: {a.admin_depth || 0}</Badge>
                    </div>
                    {a.approver && (
                      <p className="text-xs text-muted-foreground text-right">
                        Approved by<br/>
                        <span className="font-semibold">{a.approver.name}</span>
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end border-t pt-4">
                  {canManage ? (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)} disabled={loadingId === a.id}>
                      Remove Admin
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">You lack clearance to modify this admin.</p>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="pt-8 border-t">
        <h2 className="text-xl font-semibold tracking-tight mb-2">Power Matrix Visualization</h2>
        <p className="text-sm text-muted-foreground mb-4">A visual map of the administration tree. Root admins are at the top.</p>
        <AdminHierarchyGraph admins={allApprovedAdmins} currentUserId={currentUserId} />
      </div>
    </div>
  );
}

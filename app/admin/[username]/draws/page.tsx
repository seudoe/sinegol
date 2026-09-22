import { requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { DrawManager } from "@/components/domain/draw-manager";

export default async function AdminDrawsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await requireAdmin(username);
  
  const admin = createAdminClient();
  const { data: draws } = await admin.from("draws").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Draw Engine</h1>
      
      <DrawManager username={username} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Past Draws</h2>
        {draws?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No draws published yet.</p>
        ) : (
          <div className="flex flex-col gap-2 max-w-2xl">
            {draws?.map(d => (
              <div key={d.id} className="p-4 border rounded-lg flex justify-between items-center bg-card">
                <div>
                  <p className="font-medium">{d.month}</p>
                  <p className="text-sm text-muted-foreground capitalize">{d.method} Engine</p>
                </div>
                <div className="flex gap-2">
                  {d.numbers.map((n: number, i: number) => (
                    <span key={i} className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

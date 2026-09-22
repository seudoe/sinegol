import { requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { CharityPicker } from "@/components/domain/charity-picker";

export default async function UserCharityPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await requireUser(username);
  const admin = createAdminClient();

  const [{ data: charities }, { data: currentSelection }] = await Promise.all([
    admin.from("charities").select("id, name, description"),
    admin.from("user_charities").select("charity_id, contribution_percentage").eq("user_id", profile.id).single()
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Choose Your Charity</h1>
      <p className="text-muted-foreground">Select a charity to support with your winnings.</p>
      
      <CharityPicker 
        charities={charities || []} 
        username={username} 
        initialSelection={currentSelection ? { charity_id: currentSelection.charity_id, percentage: currentSelection.contribution_percentage } : undefined} 
      />
    </div>
  );
}

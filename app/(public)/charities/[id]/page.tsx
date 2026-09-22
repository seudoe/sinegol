import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CharityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: charity, error } = await admin.from("charities").select("*").eq("id", id).single();
  
  if (error || !charity) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight mb-4">{charity.name}</h1>
      <p className="text-lg text-muted-foreground mb-8 whitespace-pre-wrap">{charity.description}</p>
      
      <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
        Support this charity
      </Button>
    </div>
  );
}

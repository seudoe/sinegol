import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CharityInfoDialog } from "@/components/domain/charity-info-dialog";
import { Button } from "@/components/ui/button";

export default async function CharitiesPage() {
  const admin = createAdminClient();
  const { data: charities } = await admin.from("charities").select("id, name, description");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Charities</h1>
      <p className="mt-2 text-muted-foreground mb-8">
        Browse the charities Sinegol members support.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities?.map(charity => (
          <Card key={charity.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex-1">
              <CardTitle>{charity.name}</CardTitle>
              <CardDescription className="line-clamp-3">{charity.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <CharityInfoDialog charity={charity} />
              <Button render={<Link href={`/signup`} />} nativeButton={false} size="sm" className="w-full">
                Support
              </Button>
            </CardFooter>
          </Card>
        ))}
        {charities?.length === 0 && <p>No charities found.</p>}
      </div>
    </div>
  );
}

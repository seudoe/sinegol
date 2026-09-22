import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CharityInfoDialog } from "@/components/domain/charity-info-dialog";
import { Button } from "@/components/ui/button";

export default async function CharitiesPage() {
  const admin = createAdminClient();
  const { data: charities } = await admin.from("charities").select("id, name, description, image_url").order("featured", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Our Charity Partners</h1>
        <p className="text-lg text-muted-foreground">
          Browse the incredible verified charities Sinegol members actively support. Select your cause when you subscribe.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities?.map(charity => (
          <Card key={charity.id} className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-muted group">
            {charity.image_url ? (
              <div className="w-full h-48 relative overflow-hidden bg-muted">
                <img src={charity.image_url} alt={charity.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-3 bg-primary" />
            )}
            
            <CardHeader className="flex-1 pt-6">
              <CardTitle className="text-xl">{charity.name}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-base leading-relaxed">{charity.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-3 pb-6 pt-0">
              <CharityInfoDialog charity={charity} />
              <Button render={<Link href={`/signup`} />} nativeButton={false} size="sm" className="w-full">
                Support this cause
              </Button>
            </CardFooter>
          </Card>
        ))}
        {charities?.length === 0 && (
          <div className="col-span-full text-center py-24 text-muted-foreground">
            No charities found at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CharityInfoDialog } from "@/components/domain/charity-info-dialog";

const STEPS = [
  "Subscribe",
  "Play golf / enter scores",
  "Monthly draw",
  "Chance to win",
  "Support charity",
];

export default async function HomePage() {
  const admin = createAdminClient();
  const { data: charities } = await admin.from("charities").select("id, name, description").limit(3);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Play golf. Win prizes. Fund charity.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Sinegol turns your golf scores into a monthly draw — every
        subscription supports the charity you choose.
      </p>
      <ol className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="rounded-full border px-4 py-2">{step}</span>
            {i < STEPS.length - 1 && (
              <span className="text-muted-foreground">&rarr;</span>
            )}
          </li>
        ))}
      </ol>
      <div className="flex gap-4 mb-24">
        <Button render={<Link href="/signup" />} nativeButton={false} size="lg">
          Get started
        </Button>
        <Button
          render={<Link href="/how-it-works" />}
          nativeButton={false}
          size="lg"
          variant="outline"
        >
          How it works
        </Button>
      </div>

      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">Featured Charities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
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
        </div>
        <Button render={<Link href="/charities" />} nativeButton={false} variant="link" className="mt-6">
          View all charities &rarr;
        </Button>
      </div>
    </div>
  );
}

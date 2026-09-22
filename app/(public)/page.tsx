import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
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
  const { data: charities } = await admin.from("charities").select("id, name, description, image_url").limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 text-center w-full px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 relative z-10">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Join the revolution of giving
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Play golf. Win prizes. <br className="hidden sm:block" /> Fund charity.
          </h1>
          
          <p className="max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Sinegol turns your raw golf scores into a monthly draw — every
            subscription actively supports the charity of your choice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Button render={<Link href="/signup" />} nativeButton={false} size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/30 transition-transform hover:scale-105">
              Get started for free
            </Button>
            <Button
              render={<Link href="/how-it-works" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-full"
            >
              How it works
            </Button>
          </div>
          
          <ol className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium mt-12 bg-card/50 backdrop-blur-md border rounded-2xl p-4 shadow-sm">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{step}</span>
                {i < STEPS.length - 1 && (
                  <span className="text-muted-foreground/50">&rarr;</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section className="w-full py-24 bg-muted/30 border-t">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Make an Impact</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A minimum of 10% of your potential winnings always goes to a verified charity. Here are some of the causes our community supports.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full text-left">
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
          </div>
          
          <Button render={<Link href="/charities" />} nativeButton={false} variant="outline" size="lg" className="mt-12 rounded-full px-8">
            View all charities &rarr;
          </Button>
        </div>
      </section>

      <footer className="w-full py-12 border-t flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground mb-4">&copy; {new Date().getFullYear()} Sinegol. All rights reserved.</p>
        <Link href="/auth/admin-signup" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Admin Sign Up
        </Link>
      </footer>
    </div>
  );
}

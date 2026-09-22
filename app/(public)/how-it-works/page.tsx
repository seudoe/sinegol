import { ArrowRightIcon, CheckCircle2, TrophyIcon, WalletCards, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1. Choose Your Plan & Charity",
      description: "Subscribe to Sinegol and instantly select a verified charity you'd like to support. A minimum of 10% of any prize you win is automatically pledged to them.",
      icon: <WalletCards className="h-8 w-8 text-primary" />
    },
    {
      title: "2. Play Golf & Log Scores",
      description: "Head out to the course and play your game. Log your raw golf scores (between 1-45) directly into the platform. These scores act as your 'tickets' for the monthly draw.",
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />
    },
    {
      title: "3. The Monthly Draw",
      description: "At the end of every month, our Algorithmic Draw Engine selects 5 winning numbers. We match your logged scores against the draw to determine if you've hit 3, 4, or 5 matches.",
      icon: <TrophyIcon className="h-8 w-8 text-primary" />
    },
    {
      title: "4. Win & Give Back",
      description: "If you win, your prize money is automatically split. Your pledged percentage goes directly to your chosen charity, and you keep the rest! It's a win-win for everyone.",
      icon: <HeartHandshake className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          How Sinegol Works
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Combining the thrill of golf with the power of philanthropy. Here is exactly how your scores turn into real-world impact.
        </p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="text-sm font-bold">{idx + 1}</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-24 text-center bg-muted/50 rounded-3xl p-10 border">
        <h2 className="text-3xl font-bold mb-4">Ready to tee off?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join hundreds of golfers who are already turning their scorecards into charitable donations.
        </p>
        <Button render={<Link href="/signup" />} nativeButton={false} size="lg" className="rounded-full px-8 h-14 text-lg group">
          Get Started Now <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

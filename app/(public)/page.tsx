import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Subscribe",
  "Play golf / enter scores",
  "Monthly draw",
  "Chance to win",
  "Support charity",
];

export default function HomePage() {
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
      <div className="flex gap-4">
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
    </div>
  );
}

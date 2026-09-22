export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center">
        <span className="font-heading text-lg tracking-tight text-foreground">
          Sinegol
        </span>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
          &copy; {new Date().getFullYear()} Sinegol &middot; Golf &amp; Charity
        </p>
      </div>
    </footer>
  );
}

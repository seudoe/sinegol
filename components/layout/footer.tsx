export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Sinegol
      </div>
    </footer>
  );
}

import Link from "next/link";

export interface SidebarItem {
  label: string;
  href: string;
}

export function Sidebar({ items }: { items: SidebarItem[] }) {
  return (
    <nav className="w-56 shrink-0 border-r px-4 py-6">
      <ul className="flex flex-col gap-1 text-sm font-medium">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

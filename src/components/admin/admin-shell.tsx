import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import {
  BriefcaseBusiness,
  Code2,
  LayoutDashboard,
  Layers3,
  Link2,
  LogOut,
  MessageSquare,
  Wrench,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Code2 },
  { href: "/admin/skills", label: "Skills", icon: Layers3 },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/social-links", label: "Social Links", icon: Link2 },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/35">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BriefcaseBusiness aria-hidden="true" className="size-4" />
            </span>
            <span>Portfolio Admin</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-background p-3 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5">
          <nav
            aria-label="Admin navigation"
            className="flex gap-2 overflow-x-auto lg:flex-col"
          >
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 px-4 py-7 sm:px-6 lg:px-9 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

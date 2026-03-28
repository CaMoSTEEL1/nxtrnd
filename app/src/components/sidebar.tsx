"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  Package,
  Settings,
  Sun,
  Moon,
} from "lucide-react";

const NAV = [
  { label: "Overview",    href: "/",            icon: LayoutDashboard },
  { label: "Influencers", href: "/influencers",  icon: Users },
  { label: "Products",    href: "/products",     icon: Package },
  { label: "Scripts",     href: "/scripts",      icon: FileText },
  { label: "Videos",      href: "/videos",       icon: Video },
];

const NAV_BOTTOM = [
  { label: "Settings",    href: "/settings",     icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col"
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Wordmark — no icon box */}
      <div
        className="px-5 py-6"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <Link href="/" className="block">
          <span
            className="text-[17px] font-extrabold tracking-tighter"
            style={{ color: "var(--foreground)" }}
          >
            NXT
          </span>
          <span
            className="text-[17px] font-extrabold tracking-tighter"
            style={{ color: "var(--primary)" }}
          >
            RND
          </span>
        </Link>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--foreground-muted)" }}>
          AI influencer content
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              isActive(href)
                ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text-active)]"
                : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-active)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-[15px] w-[15px] shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom nav + theme */}
      <div
        className="px-3 py-3 space-y-0.5"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        {NAV_BOTTOM.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              isActive(href)
                ? "bg-[var(--sidebar-active)] text-[var(--sidebar-text-active)]"
                : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-active)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-[15px] w-[15px] shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[var(--sidebar-active)]"
          style={{ color: "var(--sidebar-text)" }}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-[15px] w-[15px]" />
          ) : (
            <Moon className="h-[15px] w-[15px]" />
          )}
          {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}

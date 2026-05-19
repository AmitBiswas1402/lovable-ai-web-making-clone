"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import { BarChart3, LayoutDashboard, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const { user } = useUser();

  const isEditorPage = pathname.startsWith("/projects/");

  if (isEditorPage) {
    return (
      <div className="flex h-screen flex-col bg-background text-foreground">
        <div className="flex flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setsidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col items-center overflow-y-auto bg-zinc-900 p-3 transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 w-full items-center justify-between px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            {/* <img src="/globe.svg" alt="Logo" className="size-7" /> */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-none">
              <span className="text-sm font-medium tracking-wide text-white/60">
                AI
              </span>

              <span className="text-lg font-semibold tracking-tight text-white">
                Builder
              </span>
            </div>
          </Link>
          <Button
            onClick={() => setsidebarOpen(!sidebarOpen)}
            variant="ghost"
            className="md:hidden"
            size={"icon-xs"}
          >
            <X className="size-4" />
          </Button>
        </div>

        <Separator />

        <nav className="flex w-full flex-1 flex-col items-center space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={cn(
                  "flex w-full max-w-60 items-center  gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex w-full flex-col items-center space-y-4 px-3 pb-3 pt-6">
          <div className="text-sm font-medium text-muted-foreground">Credits</div>
          <Separator />

          <div className="flex items-center gap-3 px-2 pb-2">
            <UserButton appearance={{}} />
            <span className="text-sm font-semibold text-gray-200">
              {user?.fullName}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
export default AppLayout;

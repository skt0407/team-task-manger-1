"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, FolderKanban, ListTodo, LogOut, Moon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: ListTodo }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="min-h-screen p-6">
        <Skeleton className="h-12 w-56" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card/70 p-4 backdrop-blur lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Users className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">TeamFlow</span>
            <span className="text-xs text-muted-foreground">Task Manager</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as {user.role.toLowerCase()}</p>
              <h1 className="text-lg font-semibold">{user.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" title="Dark mode">
                <Moon className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-3 border-b bg-card lg:hidden">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex items-center justify-center gap-2 py-3 text-sm", active && "text-primary")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

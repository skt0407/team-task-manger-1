import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AppShell } from "@/components/layout/AppShell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Track workload, progress, overdue work, and recent movement.</p>
      </div>
      <DashboardStats />
    </AppShell>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Summary = {
  totalTasks: number;
  overdueTasks: number;
  tasksByStatus: { status: string; count: number }[];
  tasksByPriority: { priority: string; count: number }[];
  tasksPerUser: { count: number; user: { name: string; email: string } | null }[];
  recentActivity: { id: string; message: string; createdAt: string; user: { name: string } }[];
};

export function DashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get<{ summary: Summary }>("/dashboard/summary");
      return res.data.summary;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  const done = data?.tasksByStatus.find((item) => item.status === "DONE")?.count ?? 0;
  const inProgress = data?.tasksByStatus.find((item) => item.status === "IN_PROGRESS")?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Total tasks" value={data?.totalTasks ?? 0} icon={ListChecks} />
        <Metric title="In progress" value={inProgress} icon={Clock} />
        <Metric title="Completed" value={done} icon={CheckCircle2} />
        <Metric title="Overdue" value={data?.overdueTasks ?? 0} icon={AlertTriangle} danger />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks per user</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.tasksPerUser.length ? (
              data.tasksPerUser.map((item) => (
                <div key={item.user?.email ?? "unassigned"} className="flex items-center justify-between rounded-md bg-secondary p-3">
                  <span className="text-sm">{item.user?.name ?? "Unassigned"}</span>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No assigned tasks yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentActivity.length ? (
              data.recentActivity.map((item) => (
                <div key={item.id} className="rounded-md border p-3">
                  <p className="text-sm">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.user.name} · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Activity will appear here as your team works.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
  danger
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  danger?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <span className={danger ? "text-destructive" : "text-primary"}>
          <Icon className="h-6 w-6" />
        </span>
      </CardContent>
    </Card>
  );
}

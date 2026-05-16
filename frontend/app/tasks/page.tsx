"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/useTasks";
import type { Priority, TaskStatus } from "@/types/task";

export default function TasksPage() {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [priority, setPriority] = useState<Priority | undefined>();
  const { data: tasks = [], isLoading } = useTasks({ status, priority });

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <p className="text-sm text-muted-foreground">Filter all visible tasks by status and priority.</p>
        </div>
        <TaskFilters status={status} priority={priority} onStatus={setStatus} onPriority={setPriority} />
      </div>
      {isLoading ? <Skeleton className="h-80" /> : <TaskTable tasks={tasks} />}
    </AppShell>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import type { Priority, TaskStatus } from "@/types/task";

export function TaskFilters({
  status,
  priority,
  onStatus,
  onPriority
}: {
  status?: TaskStatus;
  priority?: Priority;
  onStatus: (value?: TaskStatus) => void;
  onPriority: (value?: Priority) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {([undefined, "TODO", "IN_PROGRESS", "DONE"] as Array<TaskStatus | undefined>).map((item) => (
        <Button
          key={item ?? "all-status"}
          variant={status === item ? "default" : "secondary"}
          size="sm"
          onClick={() => onStatus(item)}
        >
          {item ? item.replace("_", " ") : "All status"}
        </Button>
      ))}
      {([undefined, "LOW", "MEDIUM", "HIGH"] as Array<Priority | undefined>).map((item) => (
        <Button
          key={item ?? "all-priority"}
          variant={priority === item ? "default" : "outline"}
          size="sm"
          onClick={() => onPriority(item)}
        >
          {item ? item.toLowerCase() : "All priority"}
        </Button>
      ))}
    </div>
  );
}

"use client";

import { formatDistanceToNow, isBefore, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { useDeleteTask, useUpdateTask, useUpdateTaskStatus } from "@/hooks/useTasks";
import type { Task, TaskStatus } from "@/types/task";

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done"
};

export function TaskTable({ tasks }: { tasks: Task[] }) {
  const { user } = useAuth();
  const updateStatus = useUpdateTaskStatus();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
          No tasks match this view.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full min-w-[760px] border-collapse bg-card text-sm">
        <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">Task</th>
            <th className="p-3">Assignee</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Status</th>
            <th className="p-3">Due</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = Boolean(task.dueDate && task.status !== "DONE" && isBefore(parseISO(task.dueDate), new Date()));
            return (
              <tr key={task.id} className="border-t">
                <td className="p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{task.description}</p>
                </td>
                <td className="p-3">{task.assignedTo?.name ?? "Unassigned"}</td>
                <td className="p-3">
                  <Badge variant={task.priority === "HIGH" ? "danger" : task.priority === "MEDIUM" ? "warning" : "info"}>
                    {task.priority.toLowerCase()}
                  </Badge>
                </td>
                <td className="p-3">
                  {user?.role === "MEMBER" ? (
                    <Select
                      value={task.status}
                      onChange={(status) => updateTask.mutate({ taskId: task.id, input: { status: status as TaskStatus } })}
                      options={[
                        { value: "TODO", label: "To Do" },
                        { value: "IN_PROGRESS", label: "In Progress" },
                        { value: "DONE", label: "Done" }
                      ]}
                    />
                  ) : (
                    <Badge variant={task.status === "DONE" ? "success" : "default"}>{statusLabels[task.status]}</Badge>
                  )}
                </td>
                <td className="p-3">
                  {task.dueDate ? (
                    <span className={overdue ? "text-destructive" : ""}>
                      {overdue ? "Overdue " : ""}
                      {formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true })}
                    </span>
                  ) : (
                    "No due date"
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    {task.status !== "DONE" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          updateStatus.mutate({
                            taskId: task.id,
                            status: task.status === "TODO" ? "IN_PROGRESS" : "DONE"
                          })
                        }
                      >
                        {task.status === "TODO" ? "Start" : "Finish"}
                      </Button>
                    ) : (
                      <span className="self-center text-xs text-muted-foreground">Complete</span>
                    )}
                    {user?.role === "ADMIN" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateTask.mutate({
                              taskId: task.id,
                              input: {
                                status: task.status === "DONE" ? "TODO" : "DONE"
                              }
                            })
                          }
                        >
                          Toggle
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteTask.mutate(task.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/useProjects";
import { useCreateTask, useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/providers/AuthProvider";
import type { Priority, TaskStatus } from "@/types/task";

export default function TasksPage() {
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [priority, setPriority] = useState<Priority | undefined>();
  const [projectId, setProjectId] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("MEDIUM");
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks({ status, priority });
  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();
  const selectedProject = projects.find((project) => project.id === projectId);

  async function onCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectId || !title.trim()) {
      toast.error("Project and title are required");
      return;
    }

    try {
      await createTask.mutateAsync({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        priority: newPriority,
        status: "TODO",
        projectId,
        assignedToId: assignedToId || null
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedToId("");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not create task");
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <p className="text-sm text-muted-foreground">Filter all visible tasks by status and priority.</p>
        </div>
        <TaskFilters status={status} priority={priority} onStatus={setStatus} onPriority={setPriority} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>{isLoading ? <Skeleton className="h-80" /> : <TaskTable tasks={tasks} />}</div>
        {user?.role === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle>Create task</CardTitle>
              <CardDescription>Create work across any project.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onCreateTask}>
                <Select
                  value={projectId}
                  placeholder="Project"
                  onChange={(value) => {
                    setProjectId(value);
                    setAssignedToId("");
                  }}
                  options={projects.map((project) => ({ value: project.id, label: project.name }))}
                />
                <Input placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} />
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                <Select
                  value={newPriority}
                  onChange={(value) => setNewPriority(value as Priority)}
                  options={[
                    { value: "LOW", label: "Low priority" },
                    { value: "MEDIUM", label: "Medium priority" },
                    { value: "HIGH", label: "High priority" }
                  ]}
                />
                <Select
                  value={assignedToId}
                  placeholder="Unassigned"
                  onChange={setAssignedToId}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...(selectedProject?.members.map((member) => ({
                      value: member.userId,
                      label: member.user?.name ?? member.userId,
                      description: member.user?.email
                    })) ?? [])
                  ]}
                />
                <Button disabled={createTask.isPending}>Create task</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

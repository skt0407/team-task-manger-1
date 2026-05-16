"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateTask } from "@/hooks/useTasks";
import { useAddProjectMember, useProject, useRemoveProjectMember, useUsers } from "@/hooks/useProjects";
import { useAuth } from "@/providers/AuthProvider";
import type { Priority } from "@/types/task";

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { data: project, isLoading } = useProject(params.projectId);
  const { data: users = [] } = useUsers(user?.role === "ADMIN");
  const createTask = useCreateTask();
  const addMember = useAddProjectMember(params.projectId);
  const removeMember = useRemoveProjectMember(params.projectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [assignedToId, setAssignedToId] = useState("");
  const [memberToAdd, setMemberToAdd] = useState("");

  async function onCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createTask.mutateAsync({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        priority,
        status: "TODO",
        projectId: params.projectId,
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
      {isLoading || !project ? (
        <Skeleton className="h-96" />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <p className="text-sm text-muted-foreground">{project.description ?? "No project description"}</p>
            </div>
            <div className="flex gap-2">
              <Badge>{project.members.length} members</Badge>
              <Badge>{project.tasks.length} tasks</Badge>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <TaskTable tasks={project.tasks} />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>People assigned to this project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium">{member.user?.name ?? member.userId}</p>
                        <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                      </div>
                      {user?.role === "ADMIN" && (
                        <Button size="sm" variant="outline" onClick={() => removeMember.mutate(member.userId)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  {user?.role === "ADMIN" && (
                    <div className="flex gap-2 pt-2">
                      <select
                        className="h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm"
                        value={memberToAdd}
                        onChange={(event) => setMemberToAdd(event.target.value)}
                      >
                        <option value="">Select user</option>
                        {users
                          .filter((candidate) => !project.members.some((member) => member.userId === candidate.id))
                          .map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                              {candidate.name}
                            </option>
                          ))}
                      </select>
                      <Button
                        variant="secondary"
                        disabled={!memberToAdd}
                        onClick={() => {
                          addMember.mutate(memberToAdd);
                          setMemberToAdd("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {user?.role === "ADMIN" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create task</CardTitle>
                    <CardDescription>Assign work to a project member.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={onCreateTask}>
                      <Input placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                      <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                      <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                      <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value as Priority)}
                      >
                        <option value="LOW">Low priority</option>
                        <option value="MEDIUM">Medium priority</option>
                        <option value="HIGH">High priority</option>
                      </select>
                      <select
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        value={assignedToId}
                        onChange={(event) => setAssignedToId(event.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {project.members.map((member) => (
                          <option key={member.userId} value={member.userId}>
                            {member.user?.name ?? member.userId}
                          </option>
                        ))}
                      </select>
                      <Button disabled={createTask.isPending}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create task
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

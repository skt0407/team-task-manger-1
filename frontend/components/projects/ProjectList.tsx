"use client";

import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import { useCreateProject, useProjects } from "@/hooks/useProjects";

export function ProjectList() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createProject.mutateAsync({ name, description });
      setName("");
      setDescription("");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not create project");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading projects...</p>}
        {!isLoading && projects.length === 0 && (
          <Card>
            <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
              <FolderKanban className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium">No projects yet</p>
              <p className="text-sm text-muted-foreground">Admins can create the first project.</p>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description ?? "No description"}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between text-sm text-muted-foreground">
                  <span>{project.members.length} members</span>
                  <span>{project.tasks.length} tasks</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {user?.role === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Start a workspace for a team initiative.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Input placeholder="Project name" value={name} onChange={(event) => setName(event.target.value)} required />
              <Textarea
                placeholder="Short description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Button disabled={createProject.isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

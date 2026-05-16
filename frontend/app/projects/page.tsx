import { AppShell } from "@/components/layout/AppShell";
import { ProjectList } from "@/components/projects/ProjectList";

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">Create workspaces, review members, and open task boards.</p>
      </div>
      <ProjectList />
    </AppShell>
  );
}

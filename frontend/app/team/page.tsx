"use client";

import { useMemo, useState } from "react";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateUserRole, useUsers } from "@/hooks/useProjects";
import { useAuth } from "@/providers/AuthProvider";

export default function TeamPage() {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useUsers(user?.role === "ADMIN");
  const updateRole = useUpdateUserRole();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const filtered = useMemo(
    () =>
      users.filter((candidate) => {
        const matchesSearch = `${candidate.name} ${candidate.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesRole = role ? candidate.role === role : true;
        return matchesSearch && matchesRole;
      }),
    [role, search, users]
  );

  const adminCount = users.filter((candidate) => candidate.role === "ADMIN").length;

  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Team</h2>
        <p className="text-sm text-muted-foreground">Search users and manage admin/member access.</p>
      </div>

      {user?.role !== "ADMIN" ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Only admins can manage the team.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <Input placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Select
              value={role}
              placeholder="All roles"
              onChange={setRole}
              options={[
                { value: "", label: "All roles" },
                { value: "ADMIN", label: "Admins" },
                { value: "MEMBER", label: "Members" }
              ]}
            />
            <Badge className="justify-center">
              {adminCount} admins · {users.length} total
            </Badge>
          </div>

          {isLoading ? (
            <Skeleton className="h-72" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Directory</CardTitle>
                <CardDescription>Role changes are protected against self-change and last-admin demotion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filtered.map((candidate) => (
                  <div key={candidate.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_180px] md:items-center">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                        {candidate.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                    <Select
                      value={candidate.role}
                      onChange={(nextRole) => {
                        updateRole.mutate(
                          { userId: candidate.id, role: nextRole as "ADMIN" | "MEMBER" },
                          { onError: (error: any) => toast.error(error.response?.data?.message ?? "Could not update role") }
                        );
                      }}
                      options={[
                        { value: "ADMIN", label: "Admin", description: "Can manage projects, tasks, and team" },
                        { value: "MEMBER", label: "Member", description: "Can view and update assigned work" }
                      ]}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}

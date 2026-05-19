"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        name,
        email,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">Update your account details and password.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary text-2xl font-semibold text-primary-foreground">
              {user?.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-3 text-sm">Role: {user?.role.toLowerCase()}</p>
            {user?.createdAt && (
              <p className="mt-6 text-xs text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>Leave password fields empty unless you want to change your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSave}>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New password</Label>
                  <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                </div>
              </div>
              <Button disabled={saving}>Save changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

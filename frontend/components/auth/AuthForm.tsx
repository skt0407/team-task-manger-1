"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "signup" ? "Create your account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {mode === "signup"
            ? "The first registered user becomes the admin."
            : "Use your company task manager credentials."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
          <Button className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Sign up" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="text-primary hover:underline" href={mode === "signup" ? "/auth/login" : "/auth/signup"}>
            {mode === "signup" ? "Log in" : "Sign up"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

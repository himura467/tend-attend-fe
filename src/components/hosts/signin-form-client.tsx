"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createAuthToken } from "@/services/api/hosts";

export default function SignInFormClient() {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createAuthToken({
        username: JSON.stringify({ host_name: name, group: "host" }),
        password: password,
      });

      router.push("/hosts");
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>
        <Link href="/src/app/hosts/forgotpassword" className="text-sm font-medium text-primary hover:text-primary/80">
          Forgot your password?
        </Link>
      </div>
      {error && <p>{error}</p>}
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}

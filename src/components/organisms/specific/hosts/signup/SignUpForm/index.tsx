"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createHostAccount } from "@/lib/api/hosts";
import { rr } from "@/lib/utils/reverse-router";
import { routerPush } from "@/lib/utils/router";
import { useRouter } from "next/navigation";

export const SignUpForm = (): React.JSX.Element => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const response = await createHostAccount({
        host_name: name,
        password: password,
        email: email,
      });

      if (response.error_codes.length > 0) {
        setError("An error occurred. Please try again.");
      } else {
        routerPush(rr.hosts.signin.index(), router);
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
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
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      {error && <p>{error}</p>}
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
};

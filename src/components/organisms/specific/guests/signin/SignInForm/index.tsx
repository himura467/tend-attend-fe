"use client";

import Link from "next/link";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createAuthToken } from "@/lib/api/auth";
import { routerPush } from "@/lib/utils/router";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SignInFormProps {
  location: string;
}

export const SignInForm = ({ location }: SignInFormProps): React.JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();
  const [guestFirstName, setGuestFirstName] = React.useState("");
  const [guestLastName, setGuestLastName] = React.useState("");
  const [guestNickname, setGuestNickname] = React.useState("");
  const [hostName, setHostName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await createAuthToken({
        username: JSON.stringify({
          guest_first_name: guestFirstName,
          guest_last_name: guestLastName,
          guest_nickname: guestNickname,
          host_name: hostName,
          group: "guest",
        }),
        password: password,
      });

      routerPush({ href: location }, router);
    } catch {
      toast({
        title: "An error occurred",
        description: "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="guest-first-name">Guest First Name</Label>
        <Input
          id="guest-first-name"
          type="text"
          placeholder="Enter your first name"
          required
          value={guestFirstName}
          onChange={(e) => setGuestFirstName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="guest-last-name">Guest Last Name</Label>
        <Input
          id="guest-last-name"
          type="text"
          placeholder="Enter your last name"
          required
          value={guestLastName}
          onChange={(e) => setGuestLastName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="guest-nickname">Guest Nickname</Label>
        <Input
          id="guest-nickname"
          type="text"
          placeholder="Enter your nickname"
          required
          value={guestNickname}
          onChange={(e) => setGuestNickname(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="host-name">Host Name</Label>
        <Input
          id="host-name"
          type="text"
          placeholder="Enter your host name"
          required
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
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
        <Link href="/hosts/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
          Forgot your password?
        </Link>
      </div>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
};

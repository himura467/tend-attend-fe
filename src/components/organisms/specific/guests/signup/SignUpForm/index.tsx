"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGuestAccount } from "@/lib/api/guests";
import { rr } from "@/lib/utils/reverse-router";
import { routerPush } from "@/lib/utils/router";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Gender, GenderType, GenderRecord } from "@/lib/types/account/gender";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SignUpForm = (): React.JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();
  const [guestFirstName, setGuestFirstName] = React.useState("");
  const [guestLastName, setGuestLastName] = React.useState("");
  const [guestNickname, setGuestNickname] = React.useState("");
  const [guestAge, setGuestAge] = React.useState(0);
  const [guestGender, setGuestGender] = React.useState<GenderType>(Gender.MALE);
  const [hostName, setHostName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await createGuestAccount({
        guest_first_name: guestFirstName,
        guest_last_name: guestLastName,
        guest_nickname: guestNickname,
        age: guestAge,
        gender: guestGender,
        password: password,
        host_name: hostName,
      });

      if (response.error_codes.length > 0) {
        toast({
          title: "An error occurred",
          description: "Failed to create an account",
          variant: "destructive",
        });
      } else {
        routerPush(rr.guests.signin.index(), router);
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Failed to create an account",
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
        <Label htmlFor="guest-age">Guest Age</Label>
        <Input
          id="guest-age"
          type="number"
          placeholder="Enter your age"
          required
          value={guestAge}
          onChange={(e) => setGuestAge(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <Label htmlFor="guest-gender">Guest Gender</Label>
        <Select onValueChange={(value) => setGuestGender(value as GenderType)} defaultValue={guestGender}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GenderRecord).map(([status, label]) => (
              <SelectItem key={status} value={status}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
};

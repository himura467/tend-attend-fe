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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCurrentYmdDate } from "@/lib/utils/date";
import { applyTimezone } from "@/lib/utils/timezone";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const years = Array.from({ length: 100 }, (_, i) => getCurrentYmdDate(new Date()).getFullYear() - i);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SignUpForm = (): React.JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();
  const [guestFirstName, setGuestFirstName] = React.useState("");
  const [guestLastName, setGuestLastName] = React.useState("");
  const [guestNickname, setGuestNickname] = React.useState("");
  const [guestBirthDate, setGuestBirthDate] = React.useState<Date | null>(null);
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
        birth_date: applyTimezone(
          guestBirthDate!,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          "UTC",
        ).toISOString(),
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
        <Label htmlFor="guest-birth-date">Guest Birth Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full text-left font-normal", !guestBirthDate && "text-muted-foreground")}
            >
              {guestBirthDate ? format(guestBirthDate, "yyyy-MM-dd") : "Select your birth date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]">
            <div className="flex items-center justify-between p-2">
              <Select
                value={
                  guestBirthDate
                    ? guestBirthDate.getFullYear().toString()
                    : getCurrentYmdDate(new Date()).getFullYear().toString()
                }
                onValueChange={(value) =>
                  setGuestBirthDate(
                    new Date(
                      Number(value),
                      guestBirthDate ? guestBirthDate.getMonth() : getCurrentYmdDate(new Date()).getMonth(),
                      guestBirthDate ? guestBirthDate.getDate() : getCurrentYmdDate(new Date()).getDate(),
                    ),
                  )
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={
                  guestBirthDate
                    ? guestBirthDate.getMonth().toString()
                    : getCurrentYmdDate(new Date()).getMonth().toString()
                }
                onValueChange={(value) =>
                  setGuestBirthDate(
                    new Date(
                      guestBirthDate ? guestBirthDate.getFullYear() : getCurrentYmdDate(new Date()).getFullYear(),
                      Number(value),
                      guestBirthDate ? guestBirthDate.getDate() : getCurrentYmdDate(new Date()).getDate(),
                    ),
                  )
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={
                  guestBirthDate
                    ? guestBirthDate.getDate().toString()
                    : getCurrentYmdDate(new Date()).getDate().toString()
                }
                onValueChange={(value) =>
                  setGuestBirthDate(
                    new Date(
                      guestBirthDate ? guestBirthDate.getFullYear() : getCurrentYmdDate(new Date()).getFullYear(),
                      guestBirthDate ? guestBirthDate.getMonth() : getCurrentYmdDate(new Date()).getMonth(),
                      Number(value),
                    ),
                  )
                }
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
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

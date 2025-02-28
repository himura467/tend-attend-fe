"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserAccount } from "@/lib/api/accounts";
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
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
  const [gender, setGender] = React.useState<GenderType>(Gender.MALE);
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await createUserAccount({
        username: username,
        password: password,
        nickname: nickname,
        birth_date: applyTimezone(birthDate!, Intl.DateTimeFormat().resolvedOptions().timeZone, "UTC").toISOString(),
        gender: gender,
        email: email,
        followee_usernames: [],
      });

      if (response.error_codes.length > 0) {
        toast({
          title: "An error occurred",
          description: "Failed to create an account",
          variant: "destructive",
        });
      } else {
        routerPush(rr.signin.index(), router);
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
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          type="text"
          placeholder="Enter your nickname"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
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
        <Label htmlFor="birth-date">Birth Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full text-left font-normal", !birthDate && "text-muted-foreground")}
            >
              {birthDate ? format(birthDate, "yyyy-MM-dd") : "Select your birth date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]">
            <div className="flex items-center justify-between p-2">
              <Select
                value={
                  birthDate
                    ? birthDate.getFullYear().toString()
                    : getCurrentYmdDate(new Date()).getFullYear().toString()
                }
                onValueChange={(value) =>
                  setBirthDate(
                    new Date(
                      parseInt(value),
                      birthDate ? birthDate.getMonth() : getCurrentYmdDate(new Date()).getMonth(),
                      birthDate ? birthDate.getDate() : getCurrentYmdDate(new Date()).getDate(),
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
                  birthDate ? birthDate.getMonth().toString() : getCurrentYmdDate(new Date()).getMonth().toString()
                }
                onValueChange={(value) =>
                  setBirthDate(
                    new Date(
                      birthDate ? birthDate.getFullYear() : getCurrentYmdDate(new Date()).getFullYear(),
                      parseInt(value),
                      birthDate ? birthDate.getDate() : getCurrentYmdDate(new Date()).getDate(),
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
                value={birthDate ? birthDate.getDate().toString() : getCurrentYmdDate(new Date()).getDate().toString()}
                onValueChange={(value) =>
                  setBirthDate(
                    new Date(
                      birthDate ? birthDate.getFullYear() : getCurrentYmdDate(new Date()).getFullYear(),
                      birthDate ? birthDate.getMonth() : getCurrentYmdDate(new Date()).getMonth(),
                      parseInt(value),
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
        <Label htmlFor="gender">Gender</Label>
        <Select onValueChange={(value) => setGender(value as GenderType)} defaultValue={gender}>
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

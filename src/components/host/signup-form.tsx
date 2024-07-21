import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
  return (
    <div className="w-full max-w-[500px] space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create your Host account</h1>
        <p className="mt-2 text-muted-foreground">
          Already have an account?{" "}
          <Link href="/host/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <form className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Enter your name" required />
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" required />
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </div>
  );
}

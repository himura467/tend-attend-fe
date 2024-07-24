import Link from "next/link";
import SigninFormClient from "@/components/host/signin-form-client";

export default function SigninForm() {
  return (
    <div className="w-full max-w-[500px] space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Sign in to your Host account</h1>
        <p className="mt-2 text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/host/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <SigninFormClient />
    </div>
  );
}

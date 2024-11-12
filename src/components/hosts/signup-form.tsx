import Link from "next/link";
import SignUpFormClient from "@/components/hosts/signup-form-client";

export default function SignUpForm() {
  return (
    <div className="w-full max-w-[500px] space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create your Host account</h1>
        <p className="mt-2 text-muted-foreground">
          Already have an account?{" "}
          <Link href="/src/app/hosts/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <SignUpFormClient />
    </div>
  );
}

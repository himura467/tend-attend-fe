import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import React from "react";
import Link from "next/link";
import { SignUpForm } from "@/components/organisms/specific/accounts/signup/SignUpForm";
import { rr } from "@/lib/utils/reverse-router";

const SignUpPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full max-w-[600px] space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Already have an account?{" "}
            <Link {...rr.signin.index()} className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </DialogTemplate>
  );
};

export default SignUpPage;

import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import React from "react";
import Link from "next/link";
import { SignInForm } from "@/components/organisms/specific/hosts/signin/SignInForm";
import { rr } from "@/lib/utils/reverse-router";
import { formatUrl } from "@/lib/utils/url";

const SignInPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full max-w-[600px] space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sign in to your Host account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link {...rr.hosts.signup.index()} className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        <SignInForm location={formatUrl(rr.events.edit.index().href)} />
      </div>
    </DialogTemplate>
  );
};

export default SignInPage;

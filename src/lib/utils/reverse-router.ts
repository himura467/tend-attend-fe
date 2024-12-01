import { LinkProps } from "next/link";

export const ReverseRouter = {
  index: (): LinkProps => ({ href: "/" }),
  hosts: {
    signup: {
      index: (): LinkProps => ({ href: "/hosts/signup" }),
    },
    signin: {
      index: (): LinkProps => ({ href: "/hosts/signin" }),
    },
  },
};

export const rr = ReverseRouter;

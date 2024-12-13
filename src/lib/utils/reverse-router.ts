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
  guests: {
    signup: {
      index: (): LinkProps => ({ href: "/guests/signup" }),
    },
    signin: {
      index: (): LinkProps => ({ href: "/guests/signin" }),
    },
  },
};

export const rr = ReverseRouter;

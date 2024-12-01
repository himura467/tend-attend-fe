import { LinkProps } from "next/link";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatUrl } from "@/lib/utils/url";

type Destination = Pick<LinkProps, "href">;

export const routerPush = (destination: Destination, router: AppRouterInstance): void => {
  router.push(formatUrl(destination.href));
};

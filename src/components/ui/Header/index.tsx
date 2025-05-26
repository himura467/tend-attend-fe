import { rr } from "@/lib/utils/reverse-router";
import Link from "next/link";
import React from "react";

export const Header = (): React.JSX.Element => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <nav className="hidden items-center gap-6 md:flex">
        <Link {...rr.index()} className="text-muted-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/about-us" className="text-muted-foreground hover:text-primary transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>
    </header>
  );
};

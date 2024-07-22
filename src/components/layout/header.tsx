import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
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
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted p-6 md:py-12 w-full">
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
        <FooterColumn
          title="Company"
          links={[
            { text: "About Us", href: "/about" },
            { text: "Our Team", href: "/team" },
            { text: "Careers", href: "/careers" },
            { text: "News", href: "/news" },
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            { text: "Blog", href: "/blog" },
            { text: "Community", href: "/community" },
            { text: "Support", href: "/support" },
            { text: "FAQs", href: "/faqs" },
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            { text: "Privacy Policy", href: "/legal/privacy" },
            { text: "Terms of Service", href: "/legal/terms" },
            { text: "Cookie Policy", href: "/legal/cookies" },
          ]}
        />
      </div>
    </footer>
  );
}

type LinkItem = {
  text: string;
  href: string;
};

function FooterColumn({ title, links }: { title: string; links: LinkItem[] }) {
  return (
    <div className="grid gap-1">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {links.map((link) => (
        <Link key={link.text} href={link.href} className="text-muted-foreground hover:underline">
          {link.text}
        </Link>
      ))}
    </div>
  );
}

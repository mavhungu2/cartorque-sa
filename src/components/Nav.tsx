import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/videos", label: "Videos" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[color:var(--bg)]/85 border-b border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto px-5 h-24 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Car Torque SA — home" className="flex items-center h-full">
          <Image src="/logo.png" alt="Car Torque SA" width={300} height={118} priority className="h-full w-auto" />
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/sell" className="btn-primary text-sm">
          + Sell my car
        </Link>
      </div>
    </header>
  );
}

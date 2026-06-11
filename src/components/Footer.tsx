import Link from "next/link";
import Image from "next/image";
import logoDark from "@/assets/logo-dark.png";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[color:var(--ink)] text-white">
      <div className="stripe-divider" aria-hidden />
      <div className="max-w-6xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-10 text-sm">
        <div>
          <Image src={logoDark} alt="Car Torque" className="h-24 w-auto" />
          <p className="text-white/70 mt-4 max-w-xs">Honest car reviews and motoring stories from South Africa.</p>
        </div>
        <div>
          <div className="font-semibold mb-3 text-[color:var(--accent)] uppercase tracking-wider text-xs">Explore</div>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/videos" className="hover:text-[color:var(--accent)]">Videos</Link></li>
            <li><Link href="/blog" className="hover:text-[color:var(--accent)]">Blog</Link></li>
            <li><Link href="/about" className="hover:text-[color:var(--accent)]">About</Link></li>
            <li><Link href="/contact" className="hover:text-[color:var(--accent)]">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-[color:var(--accent)]">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-[color:var(--accent)] uppercase tracking-wider text-xs">Follow</div>
          <ul className="space-y-2 text-white/80">
            <li><a href="https://www.youtube.com/@CarTorqueSA" target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">YouTube</a></li>
            <li><a href="https://www.instagram.com/car_torque_za/" target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">Instagram</a></li>
            <li><a href="https://www.facebook.com/profile.php?id=100076080243370" target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Car Torque SA. All rights reserved.
      </div>
    </footer>
  );
}

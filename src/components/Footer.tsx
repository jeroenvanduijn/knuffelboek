import Link from 'next/link';

const footerLinks = [
  { href: '/faq', label: 'Veelgestelde vragen' },
  { href: '/contact', label: 'Contact' },
  { href: '/over-ons', label: 'Over Knuffelboek' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/voorwaarden', label: 'Voorwaarden' },
  { href: '/mijn-boeken', label: 'Mijn boeken' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-inkt text-mist">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-10 text-[15px] sm:px-6 lg:px-10">
        <span className="font-display text-2xl font-extrabold text-creme">Knuffelboek</span>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-mist no-underline hover:text-creme">
              {link.label}
            </Link>
          ))}
        </nav>
        <span>© {new Date().getFullYear()} Knuffelboek</span>
      </div>
    </footer>
  );
}

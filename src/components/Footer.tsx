import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sky-dark/30 mt-auto">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">K</span>
              </div>
              <span className="text-xl font-bold text-text">Knuffelboek</span>
            </Link>
            <p className="text-text-light text-sm leading-relaxed">
              Van de lievelingsknuffel van je kind, naar een echt verhaaltje voor het slapengaan.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hoe-het-werkt" className="text-text-light hover:text-primary transition-colors text-sm">
                  Hoe het werkt
                </Link>
              </li>
              <li>
                <Link href="/themas" className="text-text-light hover:text-primary transition-colors text-sm">
                  Thema&apos;s &amp; leeftijden
                </Link>
              </li>
              <li>
                <Link href="/voorbeelden" className="text-text-light hover:text-primary transition-colors text-sm">
                  Voorbeelden
                </Link>
              </li>
              <li>
                <Link href="/prijzen" className="text-text-light hover:text-primary transition-colors text-sm">
                  Prijzen
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Ondersteuning</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-text-light hover:text-primary transition-colors text-sm">
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-light hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-text-light hover:text-primary transition-colors text-sm">
                  Over Knuffelboek
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Juridisch</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-text-light hover:text-primary transition-colors text-sm">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="text-text-light hover:text-primary transition-colors text-sm">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sky-dark/30 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-light text-sm">
            &copy; {new Date().getFullYear()} Knuffelboek. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-text-light text-sm">Veilig betalen met</span>
            <div className="flex space-x-2 text-text-light">
              <span className="text-sm font-medium">iDEAL</span>
              <span className="text-sm">|</span>
              <span className="text-sm font-medium">Bancontact</span>
              <span className="text-sm">|</span>
              <span className="text-sm font-medium">Creditcard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

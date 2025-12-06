import Link from 'next/link';
import Image from 'next/image';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

export default function Footer() {
  return (
    <footer className="bg-zand border-t border-nachtblauw/10 mt-auto">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src={LOGO_URL}
                alt="Knuffelboek"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-nachtblauw/70 text-sm leading-relaxed">
              Van de lievelingsknuffel van je kind, naar een echt verhaaltje voor het slapengaan.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-nachtblauw mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/voorbeelden" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Voorbeelden
                </Link>
              </li>
              <li>
                <Link href="/prijzen" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Prijzen
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-nachtblauw mb-4">Ondersteuning</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Veelgestelde vragen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Over Knuffelboek
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-nachtblauw mb-4">Juridisch</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="text-nachtblauw/70 hover:text-abrikoos transition-colors text-sm">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-nachtblauw/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-nachtblauw/60 text-sm">
            &copy; {new Date().getFullYear()} Knuffelboek. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-nachtblauw/60 text-sm">Veilig betalen met</span>
            <div className="flex space-x-2 text-nachtblauw/70">
              <span className="text-sm font-medium">iDEAL</span>
              <span className="text-sm">|</span>
              <span className="text-sm font-medium">Creditcard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

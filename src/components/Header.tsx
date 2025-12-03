'use client';

import Link from 'next/link';
import { useState } from 'react';
import SheepMascot from './SheepMascot';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/hoe-het-werkt', label: 'Hoe het werkt' },
    { href: '/themas', label: "Thema's" },
    { href: '/voorbeelden', label: 'Voorbeelden' },
    { href: '/prijzen', label: 'Prijzen' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="bg-wolwit shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Schaapje + woordmerk */}
          <Link href="/" className="flex items-center space-x-2">
            <SheepMascot variant="default" size="sm" />
            <span className="text-xl font-bold text-nachtblauw">Knuffelboek</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-nachtblauw/70 hover:text-nachtblauw transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Abrikoos met nachtblauwe tekst */}
          <div className="hidden lg:block">
            <Link href="/maak-je-boek" className="btn btn-primary">
              Start met jouw knuffel
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-nachtblauw/70 hover:text-nachtblauw hover:bg-zand transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu openen"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-zand">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-nachtblauw/70 hover:text-nachtblauw transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/maak-je-boek"
                className="btn btn-primary mt-4 w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start met jouw knuffel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

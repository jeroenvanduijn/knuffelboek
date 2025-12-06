'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/api';

// Logo URL
const LOGO_URL = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures/logo/Ontwerp%20zonder%20titel%20%2847%29.png';

// Webapp URL voor het maken van boeken
export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://app.knuffelboek.nl';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const navLinks = [
    { href: '/voorbeelden', label: 'Voorbeelden' },
    { href: '/prijzen', label: 'Prijzen' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="bg-wolwit shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={LOGO_URL}
              alt="Knuffelboek"
              width={180}
              height={50}
              className="h-12 lg:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
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

          {/* Right side - CTA + Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Mijn Boeken - alleen als ingelogd */}
            {isLoggedIn && (
              <Link
                href="/mijn-boeken"
                className="text-nachtblauw/70 hover:text-nachtblauw transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Mijn Boeken
              </Link>
            )}

            {/* CTA Button - links naar webapp */}
            <a
              href={WEBAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Maak je boek
            </a>

            {/* Account button - alleen voor ingelogde gebruikers */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-zand flex items-center justify-center text-nachtblauw hover:bg-pastelblauw/30 transition-colors"
                  aria-label="Account menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-wolwit rounded-xl shadow-lg border border-nachtblauw/10 py-2">
                    <Link
                      href="/mijn-boeken"
                      className="block px-4 py-2 text-nachtblauw/70 hover:text-nachtblauw hover:bg-zand transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mijn Boeken
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-nachtblauw/70 hover:text-nachtblauw hover:bg-zand transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Account instellingen
                    </Link>
                    <hr className="my-2 border-nachtblauw/10" />
                    <button
                      className="block w-full text-left px-4 py-2 text-nachtblauw/70 hover:text-red-500 hover:bg-zand transition-colors"
                      onClick={() => {
                        // TODO: implement logout
                        setShowUserMenu(false);
                      }}
                    >
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            )}
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

              {/* Mijn Boeken link voor mobile */}
              {isLoggedIn && (
                <Link
                  href="/mijn-boeken"
                  className="text-nachtblauw/70 hover:text-nachtblauw transition-colors font-medium py-2 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Mijn Boeken
                </Link>
              )}

              <hr className="border-zand" />

              {/* Auth links voor mobile - alleen voor ingelogde gebruikers */}
              {isLoggedIn && (
                <>
                  <Link
                    href="/account"
                    className="text-nachtblauw/70 hover:text-nachtblauw transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account instellingen
                  </Link>
                  <button
                    className="text-left text-nachtblauw/70 hover:text-red-500 transition-colors font-medium py-2"
                    onClick={() => {
                      // TODO: implement logout
                      setMobileMenuOpen(false);
                    }}
                  >
                    Uitloggen
                  </button>
                </>
              )}

              <a
                href={WEBAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-4 w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Maak je boek
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

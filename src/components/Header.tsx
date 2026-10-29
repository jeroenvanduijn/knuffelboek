'use client';

import Link from 'next/link';
import { useState } from 'react';
import { appUrl } from '@/lib/constants';
import SheepBadge from './SheepBadge';

const navLinks = [
  { href: '/#werkt', label: 'Zo werkt het' },
  { href: '/#voorbeelden', label: 'Voorbeelden' },
  { href: '/#prijzen', label: 'Prijzen' },
  { href: '/#cadeaubon', label: 'Cadeaubon' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 bg-creme">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 lg:py-5">
        <Link href="/" className="flex items-center gap-3 text-inkt no-underline" aria-label="Knuffelboek, naar de homepage">
          <SheepBadge size={56} priority />
          <span className="font-display text-[26px] font-extrabold leading-none lg:text-[30px]">Knuffelboek</span>
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-6 text-[17px] font-extrabold lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-inkt no-underline hover:text-koraal-donker">
              {link.label}
            </Link>
          ))}
          <a
            href={appUrl('header')}
            className="rounded-[18px] border-b-4 border-koraal-donker bg-koraal px-[26px] py-[14px] font-extrabold text-inkt no-underline transition-transform hover:-translate-y-0.5"
          >
            Maak je boek
          </a>
        </nav>

        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-inkt bg-creme text-inkt lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobiel-menu"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        >
          {open ? (
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobiel-menu"
          aria-label="Hoofdmenu"
          className="border-t-4 border-inkt bg-creme px-4 pb-6 pt-2 sm:px-6 lg:hidden"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b-2 border-dashed border-lichtblauw py-4 font-display text-[22px] font-extrabold text-inkt no-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={appUrl('header-mobiel')}
            onClick={() => setOpen(false)}
            className="mt-5 block rounded-[18px] border-b-4 border-koraal-donker bg-koraal px-6 py-4 text-center text-[19px] font-extrabold text-inkt no-underline"
          >
            Maak je boek
          </a>
        </nav>
      )}
    </header>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Zelf gehost (variabele fonts, latin, OFL). next/font/google faalt op Vercel af en toe
// tijdens de build omdat Google Fonts dan niet bereikbaar is.
const baloo = localFont({
  src: "./fonts/baloo2-latin.woff2",
  weight: "400 800",
  variable: "--font-baloo",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const nunito = localFont({
  src: "./fonts/nunito-latin.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const caveat = localFont({
  src: "./fonts/caveat-latin.woff2",
  weight: "400 700",
  variable: "--font-caveat",
  display: "swap",
  fallback: ["Comic Sans MS", "cursive"],
});

export const metadata: Metadata = {
  title: "Knuffelboek: een echt voorleesboek over de eigen knuffel van je kind",
  description:
    "Maak een foto van de knuffel. Wij schrijven een verhaal met de naam van je kind, tekenen alle plaatjes en drukken er een echt boek van. Hardcover €39,95, de PDF krijg je erbij.",
  keywords: ["kinderboek", "gepersonaliseerd", "knuffel", "cadeau", "kerst", "sinterklaas", "voorleesboek", "hardcover"],
  openGraph: {
    title: "Knuffelboek: vanavond voorlezen over jullie eigen knuffel",
    description:
      "Een echt boek met de knuffel en de naam van je kind. Eerst gratis een voorproefje.",
    type: "website",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${baloo.variable} ${nunito.variable} ${caveat.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

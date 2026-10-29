import type { Metadata } from "next";
import { Baloo_2, Nunito, Caveat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
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

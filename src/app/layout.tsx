import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Knuffelboek - Maak een gepersonaliseerd kinderboek met de knuffel van je kind",
  description: "Upload een foto van de lievelingsknuffel van je kind en wij maken een uniek, gepersonaliseerd kinderboek met de knuffel in de hoofdrol. Bezorgd aan huis.",
  keywords: ["kinderboek", "gepersonaliseerd", "knuffel", "cadeau", "kinderen", "voorleesboek", "uniek"],
  openGraph: {
    title: "Knuffelboek - Maak een gepersonaliseerd kinderboek",
    description: "Van de lievelingsknuffel van je kind, naar een echt verhaaltje voor het slapengaan.",
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
    <html lang="nl">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

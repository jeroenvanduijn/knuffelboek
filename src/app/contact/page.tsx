import Link from 'next/link';
import { Button } from '@/components';
import { WEBAPP_URL } from '@/lib/constants';

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-saliegroen/40 via-saliegroen/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Contact
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Heb je een vraag of wil je iets laten weten? We horen graag van je!
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="bg-pastelblauw/20 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <h3 className="text-xl font-semibold text-nachtblauw mb-2">E-mail</h3>
                    <p className="text-nachtblauw/70 mb-4">
                      Stuur ons een e-mail en we reageren zo snel mogelijk.
                    </p>
                    <a
                      href="mailto:info@knuffelboek.nl"
                      className="inline-block bg-abrikoos text-nachtblauw font-semibold px-6 py-3 rounded-xl hover:bg-abrikoos-dark transition-colors"
                    >
                      info@knuffelboek.nl
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-abrikoos/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">❓</span>
                  <div>
                    <h3 className="font-semibold text-nachtblauw mb-1">FAQ</h3>
                    <p className="text-nachtblauw/70 text-sm mb-2">
                      Misschien staat je antwoord hier al
                    </p>
                    <Link href="/faq" className="text-abrikoos hover:underline">
                      Bekijk veelgestelde vragen →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-pastelblauw/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <h3 className="font-semibold text-nachtblauw mb-1">Reactietijd</h3>
                    <p className="text-nachtblauw/70 text-sm">
                      We reageren meestal binnen 24 uur op werkdagen. In het weekend kan het iets langer duren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-nachtblauw mb-4">
            Of begin direct met je boek
          </h2>
          <p className="text-nachtblauw/70 mb-6 max-w-xl mx-auto">
            Geen vraag maar klaar om te starten? Maak in een paar minuten een uniek boek!
          </p>
          <Button href={WEBAPP_URL} size="lg">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}

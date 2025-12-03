'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button, SectionTitle } from '@/components';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-mint via-mint/50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Contact
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Heb je een vraag of wil je iets laten weten? We horen graag van je!
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-text mb-6">Stuur ons een bericht</h2>

                {isSubmitted ? (
                  <div className="bg-mint/50 rounded-2xl p-8 text-center">
                    <span className="text-5xl block mb-4">✉️</span>
                    <h3 className="text-xl font-bold text-text mb-2">Bericht verzonden!</h3>
                    <p className="text-text-light mb-6">
                      Bedankt voor je bericht. We reageren meestal binnen 24 uur.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Nieuw bericht sturen
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                          Je naam *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-sky-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="Bijv. Marie de Vries"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                          E-mailadres *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-sky-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="marie@voorbeeld.nl"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                        Onderwerp *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-sky-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                      >
                        <option value="">Kies een onderwerp...</option>
                        <option value="order">Vraag over mijn bestelling</option>
                        <option value="product">Vraag over het product</option>
                        <option value="technical">Technisch probleem</option>
                        <option value="feedback">Feedback of suggestie</option>
                        <option value="business">Zakelijk voorstel</option>
                        <option value="other">Anders</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                        Je bericht *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-sky-dark/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="Waar kunnen we je mee helpen?"
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} size="lg">
                      {isSubmitting ? 'Verzenden...' : 'Verstuur bericht'}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-text mb-6">Andere manieren</h2>

                <div className="space-y-6">
                  <div className="bg-sky/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">📧</span>
                      <div>
                        <h3 className="font-semibold text-text mb-1">E-mail</h3>
                        <p className="text-text-light text-sm mb-2">
                          Voor vragen en ondersteuning
                        </p>
                        <a href="mailto:hallo@knuffelboek.nl" className="text-primary hover:underline">
                          hallo@knuffelboek.nl
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-peach/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">❓</span>
                      <div>
                        <h3 className="font-semibold text-text mb-1">FAQ</h3>
                        <p className="text-text-light text-sm mb-2">
                          Misschien staat je antwoord hier al
                        </p>
                        <Link href="/faq" className="text-primary hover:underline">
                          Bekijk veelgestelde vragen →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-lavender/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <h3 className="font-semibold text-text mb-1">Reactietijd</h3>
                        <p className="text-text-light text-sm">
                          We reageren meestal binnen 24 uur op werkdagen. In het weekend kan het iets langer duren.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl border border-sky-dark/30">
                  <h3 className="font-semibold text-text mb-3">Tips voor snelle hulp</h3>
                  <ul className="space-y-2 text-sm text-text-light">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Vermeld je bestelnummer als je vraag over een bestelling gaat
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Beschrijf het probleem zo specifiek mogelijk
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Voeg screenshots toe als er iets misgaat
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-sky/30">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-text mb-4">
            Of begin direct met je boek
          </h2>
          <p className="text-text-light mb-6 max-w-xl mx-auto">
            Geen vraag maar klaar om te starten? Maak in een paar minuten een uniek boek!
          </p>
          <Button href="/maak-je-boek" size="lg">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}

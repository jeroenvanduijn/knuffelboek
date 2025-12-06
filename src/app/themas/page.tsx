'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, SectionTitle, SheepMascot } from '@/components';
import { WEBAPP_URL } from '@/components/Header';

// Image base URL
const IMAGE_BASE = 'https://smt0i9fnjglr6owb.public.blob.vercel-storage.com/pictures';

const themes = [
  {
    id: 'bedtijd-avontuur',
    name: 'Bedtijd Avontuur',
    ages: ['2-3', '4-5'],
    description: 'Een rustig verhaaltje om de dag mee af te sluiten. Perfect voor het slapengaan.',
    longDescription: 'De knuffel neemt je kind mee op een dromerig avontuur door wolken en sterren, om uiteindelijk veilig en slaperig weer thuis te komen.',
    image: `${IMAGE_BASE}/hero-background-92.jpg`,
    exampleSentence: '"Het was tijd om te slapen, maar Beer had nog zo veel zin in een avontuur..."',
  },
  {
    id: 'dapper-zijn',
    name: 'Dapper Zijn',
    ages: ['3-4', '4-5', '6-8'],
    description: 'Een verhaal over moed en je angsten overwinnen.',
    longDescription: 'Samen met de knuffel leert je kind dat dapper zijn niet betekent dat je nergens bang voor bent, maar dat je toch doorzet.',
    image: `${IMAGE_BASE}/hero-background-97.jpg`,
    exampleSentence: '"Lotte voelde haar hart bonzen, maar met Draakbeer naast haar wist ze dat ze alles aankon."',
  },
  {
    id: 'verjaardag',
    name: 'Verjaardag',
    ages: ['2-3', '4-5', '6-8'],
    description: 'Een feestelijk verhaal voor de verjaardag van je kind.',
    longDescription: 'De knuffel organiseert in het geheim een verrassingsfeestje. Een perfect cadeau om te geven op de grote dag!',
    image: `${IMAGE_BASE}/hero-background-93.jpg`,
    exampleSentence: '"Vandaag was Emma jarig en Konijn had een geheim plan..."',
  },
  {
    id: 'vriendschap',
    name: 'Vriendschap',
    ages: ['4-5', '6-8'],
    description: 'Over het maken en houden van vrienden.',
    longDescription: 'Een warm verhaal over wat vriendschap echt betekent: er voor elkaar zijn, samen delen, en samen lachen.',
    image: `${IMAGE_BASE}/hero-background-94.jpg`,
    exampleSentence: '"Tim had een nieuwe vriend gevonden, maar zou Olifant jaloers zijn?"',
  },
  {
    id: 'natuur-ontdekken',
    name: 'Natuur Ontdekken',
    ages: ['3-4', '4-5', '6-8'],
    description: 'Een avontuur in de natuur met dieren en planten.',
    longDescription: 'De knuffel en je kind gaan op ontdekkingstocht door het bos, ontmoeten dieren en leren over de natuur.',
    image: `${IMAGE_BASE}/hero-background-95.jpg`,
    exampleSentence: '"Kijk eens hier! riep Lucas. Een spoor van kleine pootjes in de modder..."',
  },
  {
    id: 'fantasie-wereld',
    name: 'Fantasie Wereld',
    ages: ['5-6', '6-8'],
    description: 'Een magisch avontuur in een fantasiewereld.',
    longDescription: 'Door een geheime deur belanden de knuffel en je kind in een wereld vol magie, kastelen en vriendelijke wezens.',
    image: `${IMAGE_BASE}/hero-background-96.jpg`,
    exampleSentence: '"Achter de kast was een deur die Sophie nooit eerder had gezien..."',
  },
  {
    id: 'eerste-schooldag',
    name: 'Eerste Schooldag',
    ages: ['4-5', '6-8'],
    description: 'Perfect voor kinderen die naar school gaan.',
    longDescription: 'De knuffel helpt je kind om zich minder zenuwachtig te voelen voor de eerste dag op een nieuwe school.',
    image: `${IMAGE_BASE}/hero-background-92.jpg`,
    exampleSentence: '"Morgen was de grote dag. Gelukkig mocht Nijlpaard stiekem mee in de rugzak..."',
  },
  {
    id: 'broertje-zusje',
    name: 'Broertje of Zusje',
    ages: ['2-3', '4-5'],
    description: 'Als er een baby op komst is.',
    longDescription: 'Een lief verhaal over een knuffel die ook grote broer of zus wordt, en leert wat dat betekent.',
    image: `${IMAGE_BASE}/hero-background-94.jpg`,
    exampleSentence: '"Er kwam iemand nieuws in huis, en Beer vroeg zich af of hij nog wel knuffels zou krijgen..."',
  },
];

const ageGroups = ['Alle leeftijden', '2-3 jaar', '4-5 jaar', '6-8 jaar'];

export default function ThemasPage() {
  const [selectedAge, setSelectedAge] = useState('Alle leeftijden');

  const filteredThemes = selectedAge === 'Alle leeftijden'
    ? themes
    : themes.filter(theme =>
        theme.ages.some(age => selectedAge.startsWith(age))
      );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-abrikoos/40 via-abrikoos/20 to-wolwit py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-nachtblauw mb-6">
            Thema&apos;s &amp; Leeftijden
          </h1>
          <p className="text-xl text-nachtblauw/70 max-w-2xl mx-auto">
            Kies het perfecte avontuur voor jouw kind. Elk thema is beschikbaar in verschillende versies voor verschillende leeftijden.
          </p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="section bg-wolwit">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Age Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedAge === age
                    ? 'bg-abrikoos text-nachtblauw'
                    : 'bg-pastelblauw/30 text-nachtblauw/70 hover:bg-pastelblauw/50'
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Themes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                id={theme.id}
                className="bg-wolwit rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border border-nachtblauw/5"
              >
                <div className="aspect-[16/10] relative">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nachtblauw/80 via-nachtblauw/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-xl font-bold text-wolwit drop-shadow-md">{theme.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {theme.ages.map((age) => (
                        <span
                          key={age}
                          className="text-xs font-medium bg-wolwit/90 px-3 py-1 rounded-full text-nachtblauw"
                        >
                          {age} jaar
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-nachtblauw font-medium mb-3">{theme.description}</p>
                  <p className="text-nachtblauw/80 mb-4 leading-relaxed">{theme.longDescription}</p>
                  <div className="bg-zand rounded-lg p-4 mb-4">
                    <p className="text-sm italic text-nachtblauw/90">{theme.exampleSentence}</p>
                  </div>
                  <a
                    href={WEBAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-block text-sm"
                  >
                    Kies dit thema
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Info */}
      <section className="section bg-zand">
        <div className="container mx-auto px-4 lg:px-6">
          <SectionTitle subtitle="Hoe wij verhalen aanpassen per leeftijdsgroep">
            Leeftijd maakt het verschil
          </SectionTitle>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="text-4xl mb-4">🐣</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-4">2-3 jaar</h3>
              <ul className="space-y-3 text-nachtblauw">
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>12-16 pagina&apos;s</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Zeer korte zinnen (5-8 woorden)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Veel herhaling en ritme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Eenvoudige emoties en acties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Grote, kleurrijke illustraties</span>
                </li>
              </ul>
            </div>
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="text-4xl mb-4">🦋</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-4">4-5 jaar</h3>
              <ul className="space-y-3 text-nachtblauw">
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>16-20 pagina&apos;s</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Langere zinnen (8-12 woorden)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Eenvoudige verhaallijn met begin, midden, eind</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Meer karakterontwikkeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Rijke, gedetailleerde illustraties</span>
                </li>
              </ul>
            </div>
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="text-4xl mb-4">🦅</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-4">6-8 jaar</h3>
              <ul className="space-y-3 text-nachtblauw">
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>20-24 pagina&apos;s</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Complexere zinnen en vocabulaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Meerdere plotlijnen en wendingen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Diepere emoties en lessen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-abrikoos font-bold">•</span>
                  <span>Meer tekst per pagina</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-nachtblauw text-wolwit">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <SheepMascot variant="book" size="lg" className="mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Weet je welk thema je wilt?
          </h2>
          <p className="text-xl text-wolwit/80 mb-8 max-w-xl mx-auto">
            Start nu en kies je favoriete avontuur in de webapp.
          </p>
          <a
            href={WEBAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-abrikoos text-nachtblauw font-semibold px-8 py-4 rounded-xl hover:bg-abrikoos-dark transition-colors"
          >
            Start met jouw knuffel
          </a>
        </div>
      </section>
    </>
  );
}

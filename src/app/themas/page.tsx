'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, SectionTitle, SheepMascot } from '@/components';

const themes = [
  {
    id: 'bedtijd-avontuur',
    name: 'Bedtijd Avontuur',
    ages: ['2-3', '4-5'],
    description: 'Een rustig verhaaltje om de dag mee af te sluiten. Perfect voor het slapengaan.',
    longDescription: 'De knuffel neemt je kind mee op een dromerig avontuur door wolken en sterren, om uiteindelijk veilig en slaperig weer thuis te komen.',
    icon: '🌙',
    color: 'bg-pastelblauw/30',
    exampleSentence: '"Het was tijd om te slapen, maar Beer had nog zo veel zin in een avontuur..."',
  },
  {
    id: 'dapper-zijn',
    name: 'Dapper Zijn',
    ages: ['3-4', '4-5', '6-8'],
    description: 'Een verhaal over moed en je angsten overwinnen.',
    longDescription: 'Samen met de knuffel leert je kind dat dapper zijn niet betekent dat je nergens bang voor bent, maar dat je toch doorzet.',
    icon: '🦁',
    color: 'bg-abrikoos/20',
    exampleSentence: '"Lotte voelde haar hart bonzen, maar met Draakbeer naast haar wist ze dat ze alles aankon."',
  },
  {
    id: 'verjaardag',
    name: 'Verjaardag',
    ages: ['2-3', '4-5', '6-8'],
    description: 'Een feestelijk verhaal voor de verjaardag van je kind.',
    longDescription: 'De knuffel organiseert in het geheim een verrassingsfeestje. Een perfect cadeau om te geven op de grote dag!',
    icon: '🎂',
    color: 'bg-abrikoos/30',
    exampleSentence: '"Vandaag was Emma jarig en Konijn had een geheim plan..."',
  },
  {
    id: 'vriendschap',
    name: 'Vriendschap',
    ages: ['4-5', '6-8'],
    description: 'Over het maken en houden van vrienden.',
    longDescription: 'Een warm verhaal over wat vriendschap echt betekent: er voor elkaar zijn, samen delen, en samen lachen.',
    icon: '💕',
    color: 'bg-saliegroen/30',
    exampleSentence: '"Tim had een nieuwe vriend gevonden, maar zou Olifant jaloers zijn?"',
  },
  {
    id: 'natuur-ontdekken',
    name: 'Natuur Ontdekken',
    ages: ['3-4', '4-5', '6-8'],
    description: 'Een avontuur in de natuur met dieren en planten.',
    longDescription: 'De knuffel en je kind gaan op ontdekkingstocht door het bos, ontmoeten dieren en leren over de natuur.',
    icon: '🌿',
    color: 'bg-saliegroen/20',
    exampleSentence: '"Kijk eens hier! riep Lucas. Een spoor van kleine pootjes in de modder..."',
  },
  {
    id: 'fantasie-wereld',
    name: 'Fantasie Wereld',
    ages: ['5-6', '6-8'],
    description: 'Een magisch avontuur in een fantasiewereld.',
    longDescription: 'Door een geheime deur belanden de knuffel en je kind in een wereld vol magie, kastelen en vriendelijke wezens.',
    icon: '🏰',
    color: 'bg-pastelblauw/20',
    exampleSentence: '"Achter de kast was een deur die Sophie nooit eerder had gezien..."',
  },
  {
    id: 'eerste-schooldag',
    name: 'Eerste Schooldag',
    ages: ['4-5', '6-8'],
    description: 'Perfect voor kinderen die naar school gaan.',
    longDescription: 'De knuffel helpt je kind om zich minder zenuwachtig te voelen voor de eerste dag op een nieuwe school.',
    icon: '🎒',
    color: 'bg-zand',
    exampleSentence: '"Morgen was de grote dag. Gelukkig mocht Nijlpaard stiekem mee in de rugzak..."',
  },
  {
    id: 'broertje-zusje',
    name: 'Broertje of Zusje',
    ages: ['2-3', '4-5'],
    description: 'Als er een baby op komst is.',
    longDescription: 'Een lief verhaal over een knuffel die ook grote broer of zus wordt, en leert wat dat betekent.',
    icon: '👶',
    color: 'bg-pastelblauw/30',
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
                className={`${theme.color} rounded-2xl p-6 lg:p-8 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{theme.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-nachtblauw">{theme.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {theme.ages.map((age) => (
                        <span
                          key={age}
                          className="text-xs bg-wolwit/60 px-2 py-0.5 rounded-full text-nachtblauw/70"
                        >
                          {age} jaar
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-nachtblauw/70 mb-4">{theme.description}</p>
                <p className="text-sm text-nachtblauw mb-4">{theme.longDescription}</p>
                <div className="bg-wolwit/50 rounded-lg p-4 mb-4">
                  <p className="text-sm italic text-nachtblauw/70">{theme.exampleSentence}</p>
                </div>
                <Button href="/maak-je-boek" size="sm">
                  Kies dit thema
                </Button>
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
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8">
              <div className="text-4xl mb-4">🐣</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">2-3 jaar</h3>
              <ul className="space-y-2 text-nachtblauw/70 text-sm">
                <li>• 12-16 pagina&apos;s</li>
                <li>• Zeer korte zinnen (5-8 woorden)</li>
                <li>• Veel herhaling en ritme</li>
                <li>• Eenvoudige emoties en acties</li>
                <li>• Grote, kleurrijke illustraties</li>
              </ul>
            </div>
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8">
              <div className="text-4xl mb-4">🦋</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">4-5 jaar</h3>
              <ul className="space-y-2 text-nachtblauw/70 text-sm">
                <li>• 16-20 pagina&apos;s</li>
                <li>• Langere zinnen (8-12 woorden)</li>
                <li>• Eenvoudige verhaallijn met begin, midden, eind</li>
                <li>• Meer karakterontwikkeling</li>
                <li>• Rijke, gedetailleerde illustraties</li>
              </ul>
            </div>
            <div className="bg-wolwit rounded-2xl p-6 lg:p-8">
              <div className="text-4xl mb-4">🦅</div>
              <h3 className="text-xl font-bold text-nachtblauw mb-3">6-8 jaar</h3>
              <ul className="space-y-2 text-nachtblauw/70 text-sm">
                <li>• 20-24 pagina&apos;s</li>
                <li>• Complexere zinnen en vocabulaire</li>
                <li>• Meerdere plotlijnen en wendingen</li>
                <li>• Diepere emoties en lessen</li>
                <li>• Meer tekst per pagina</li>
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
            Start nu en kies je favoriete avontuur in de wizard.
          </p>
          <Button href="/maak-je-boek" size="lg">
            Start met jouw knuffel
          </Button>
        </div>
      </section>
    </>
  );
}

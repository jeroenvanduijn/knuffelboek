import Image from 'next/image';
import Link from 'next/link';
import { FlipBookGallery, Pricing, SheepBadge } from '@/components';
import { appUrl, IMAGE_BASE, LEVERTIJD, CONTACT_EMAIL } from '@/lib/constants';

/* Afbeeldingen uit Vercel Blob (AI-beelden van de huidige site; echte foto's volgen) */
const IMG = {
  hero: `${IMAGE_BASE}/hero-background-128.jpg`, // kind leest met knuffel bij lamplicht
  stap1: `${IMAGE_BASE}/hero-background-89.jpg`, // ouder fotografeert knuffel op een stoel
  stap2: `${IMAGE_BASE}/hero-background-124.jpg`, // voorproefje op een tablet
  stap3: `${IMAGE_BASE}/hero-background-91.jpg`, // pakket met het boek voor de deur
  inHanden: `${IMAGE_BASE}/hero-background-82.jpg`, // gedrukt boek in handen
  waterverf: `${IMAGE_BASE}/stijlen/hero-background-114.jpg`,
  knuffel3d: `${IMAGE_BASE}/stijlen/hero-background-115.jpg`,
  cartoon: `${IMAGE_BASE}/stijlen/hero-background-116.jpg`,
};

const kaften = [
  { src: `${IMAGE_BASE}/voorbeeldboeken/hero-background-118.jpg`, alt: 'Voorbeeldboek Lucas en de Vriendschap', rotate: '-rotate-[4deg]' },
  { src: `${IMAGE_BASE}/voorbeeldboeken/hero-background-119.jpg`, alt: "Voorbeeldboek Emma's Verjaardagsfeest", rotate: 'rotate-[3deg]' },
  { src: `${IMAGE_BASE}/voorbeeldboeken/hero-background-120.jpg`, alt: 'Voorbeeldboek Tim en het Slaapavontuur', rotate: '-rotate-[2deg]' },
  { src: `${IMAGE_BASE}/voorbeeldboeken/hero-background-121.jpg`, alt: 'Voorbeeldboek Lotte en de Dappere Draakbeer', rotate: 'rotate-[4deg]' },
];

const marqueeItems = [
  'Kerst: bestel vóór 30 november',
  'Sinterklaas: stop een cadeaubon in de schoen',
  'Gedrukt als hardcover',
  'De PDF krijg je erbij',
  'Voor kinderen van 2 tot 8',
];

const h2Groot = 'm-0 font-display text-[clamp(38px,7vw,56px)] font-extrabold leading-none';

function Ster({ className, style }: { className: string; style: React.CSSProperties }) {
  return <div aria-hidden="true" className={`absolute rounded-full ${className}`} style={style} />;
}

function Vinkje() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-inkt">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    </span>
  );
}

/* 1. Hero: foto over de hele breedte met de crème kaart erop */
function Hero() {
  return (
    <section id="top" className="relative flex w-full items-end overflow-hidden border-t-4 border-inkt bg-avond md:min-h-[720px]">
      <div className="absolute inset-x-0 top-0 h-[380px] overflow-hidden sm:h-[460px] md:inset-0 md:h-auto">
        <div className="kb-zoom absolute inset-0">
          <Image
            src={IMG.hero}
            alt="Kind leest 's avonds een Knuffelboek, de knuffel op schoot, in zacht lamplicht"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_45%]"
          />
        </div>
      </div>

      <Ster className="kb-ster h-[9px] w-[9px] bg-geel" style={{ left: '58%', top: '9%' }} />
      <Ster className="kb-ster2 h-[6px] w-[6px] bg-creme" style={{ left: '68%', top: '20%' }} />
      <Ster className="kb-ster h-[7px] w-[7px] bg-creme" style={{ left: '80%', top: '12%' }} />
      <Ster className="kb-ster2 h-[9px] w-[9px] bg-geel" style={{ left: '90%', top: '28%' }} />
      <Ster className="kb-ster h-[5px] w-[5px] bg-creme" style={{ left: '74%', top: '34%' }} />

      <p className="absolute bottom-6 right-6 z-[2] m-0 hidden max-w-[300px] rounded-[14px] border-[3px] border-inkt bg-creme/95 px-4 py-2.5 text-sm font-extrabold text-inkt md:block">
        Wordt een echte foto of video van het boek
      </p>

      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-4 pb-10 pt-[300px] sm:px-6 sm:pt-[380px] md:px-10 md:pb-16 md:pt-28">
        <div className="relative flex max-w-[600px] flex-col gap-5 rounded-[28px] border-4 border-inkt bg-creme px-6 pb-8 pt-16 shadow-[0_18px_40px_rgba(31,42,68,0.25)] sm:px-10 sm:pb-9 sm:pt-10">
          <span className="absolute -top-12 right-5 sm:right-8">
            <SheepBadge size={96} border={5} />
          </span>
          <p className="m-0 inline-flex self-start rounded-full bg-inkt px-4 py-2 text-[14px] font-extrabold text-creme sm:text-[15px]">
            Voor Kerst, Sinterklaas en elke avond
          </p>
          <h1 className="m-0 font-display text-[clamp(40px,8vw,64px)] font-extrabold leading-none [text-wrap:pretty]">
            Vanavond voorlezen over jullie eigen knuffel
          </h1>
          <p className="m-0 text-lg text-grijs [text-wrap:pretty] sm:text-xl">
            Maak een foto van de knuffel. Wij schrijven een verhaal met de naam van je kind, tekenen alle plaatjes en drukken er een echt boek van.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={appUrl('hero')}
              className="rounded-[20px] border-b-[5px] border-koraal-donker bg-koraal px-[34px] py-[18px] text-center text-xl font-extrabold text-inkt no-underline transition-transform hover:-translate-y-0.5"
            >
              Maak je boek
            </a>
            <a
              href="#voorbeelden"
              className="rounded-[20px] border-[3px] border-inkt bg-creme px-7 py-[15px] text-center text-xl font-extrabold text-inkt no-underline"
            >
              Kijk in een boek
            </a>
          </div>
          <p className="m-0 text-base font-bold text-grijs">Eerst gratis een voorproefje. Hardcover €39,95, de PDF krijg je erbij.</p>
        </div>
      </div>
    </section>
  );
}

/* 2. Lopende balk */
function Marquee() {
  const reeks = (verborgen: boolean) =>
    marqueeItems.map((tekst) => (
      <span key={`${tekst}-${verborgen}`} className="flex items-center gap-10" aria-hidden={verborgen || undefined}>
        <span>{tekst}</span>
        <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-geel" />
      </span>
    ));

  return (
    <div className="overflow-hidden whitespace-nowrap bg-inkt py-3.5 font-display text-lg font-extrabold text-creme sm:text-[22px]">
      <div className="kb-loop flex w-max items-center gap-10">
        {reeks(false)}
        {reeks(true)}
      </div>
    </div>
  );
}

/* 3. Zo werkt het */
function ZoWerktHet() {
  const stappen = [
    {
      img: IMG.stap1,
      alt: 'Ouder fotografeert een teddybeer op een stoel',
      rotate: '-rotate-2',
      bol: 'bg-koraal text-inkt',
      titel: 'Foto maken',
      tekst: 'Zet de knuffel in het licht en klik. Vul de naam en leeftijd van je kind in en kies een verhaal.',
    },
    {
      img: IMG.stap2,
      alt: 'Het voorproefje van het boek op een tablet, met de getekende knuffel op de kaft',
      rotate: 'rotate-2',
      bol: 'bg-blauw text-creme',
      titel: 'Voorproefje bekijken',
      tekst: 'Binnen een paar minuten zie je het verhaal en de eerste tekeningen, met jouw knuffel erin. Leuk? Dan bestel je.',
    },
    {
      img: IMG.stap3,
      alt: 'Het gedrukte boek wordt bezorgd',
      rotate: '-rotate-1',
      bol: 'bg-geel text-inkt',
      titel: 'Boek op de mat',
      tekst: 'Gedrukt als hardcover en thuisbezorgd. De PDF krijg je er meteen bij, om alvast voor te lezen.',
    },
  ];

  return (
    <section id="werkt" className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pb-14 pt-16 sm:px-6 md:pb-[72px] md:pt-[88px] lg:px-10">
      <h2 className={`${h2Groot} text-center`}>Zo werkt het, in drie stappen</h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-9">
        {stappen.map((stap, i) => (
          <article key={stap.titel} className="flex flex-col items-start gap-[18px]">
            <div className={`relative aspect-[16/11] w-full overflow-hidden rounded-[22px] border-[6px] border-white shadow-[0_14px_30px_rgba(31,42,68,0.16)] ${stap.rotate}`}>
              <Image src={stap.img} alt={stap.alt} fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover" />
            </div>
            <div className="flex items-center gap-3.5">
              <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-inkt font-display text-[28px] font-extrabold ${stap.bol}`}>
                {i + 1}
              </span>
              <h3 className="m-0 font-display text-[28px] font-extrabold">{stap.titel}</h3>
            </div>
            <p className="m-0 text-grijs">{stap.tekst}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* 4. Videoplek (placeholder) */
function VideoPlek() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-16 sm:px-6 md:pb-20 lg:px-10">
      <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[28px] border-[6px] border-inkt bg-inkt p-6 text-center text-creme sm:aspect-[16/9] md:aspect-[21/9]">
        <Ster className="kb-ster h-2 w-2 bg-geel" style={{ left: '10%', top: '18%' }} />
        <Ster className="kb-ster2 h-[6px] w-[6px] bg-creme" style={{ left: '24%', top: '70%' }} />
        <Ster className="kb-ster h-[7px] w-[7px] bg-creme" style={{ left: '84%', top: '24%' }} />
        <Ster className="kb-ster2 h-[9px] w-[9px] bg-geel" style={{ left: '92%', top: '66%' }} />
        <span aria-hidden="true" className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[5px] border-creme bg-koraal md:h-24 md:w-24">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#1F2A44" stroke="none">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <p className="m-0 font-display text-[26px] font-extrabold leading-[1.1] md:text-4xl">Kijk mee in een echt Knuffelboek</p>
        <p className="m-0 rounded-[14px] bg-creme px-4 py-2.5 text-[15px] font-extrabold text-inkt">Hier komt de video van het echte boek</p>
      </div>
    </section>
  );
}

/* 5. Voorbeelden */
function Voorbeelden() {
  return (
    <section id="voorbeelden" className="bg-geel">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pb-20 pt-16 sm:px-6 md:pb-24 md:pt-20 lg:px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className={h2Groot}>Kijk in een echt Knuffelboek</h2>
          <p className="m-0 max-w-[640px] text-lg text-inkt md:text-xl">
            Elk boek is anders. De knuffel, de naam en de leeftijd van je kind maken het verhaal. Blader er zelf doorheen.
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-5 py-2 sm:gap-8 md:grid-cols-4 md:py-4">
          {kaften.map((kaft) => (
            <div
              key={kaft.src}
              className={`relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white shadow-[0_18px_40px_rgba(31,42,68,0.2)] sm:border-[6px] ${kaft.rotate}`}
            >
              <Image src={kaft.src} alt={kaft.alt} fill sizes="(min-width: 768px) 270px, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        <FlipBookGallery />
      </div>
    </section>
  );
}

/* 6. Drie stijlen */
function Stijlen() {
  const stijlen = [
    { naam: 'Waterverf', sub: 'Warm en dromerig', img: IMG.waterverf, rand: 'border-blauw', pos: 'object-[35%_50%]' },
    { naam: '3D knuffel', sub: 'Zacht en tastbaar', img: IMG.knuffel3d, rand: 'border-geel', pos: 'object-[38%_50%]' },
    { naam: 'Cartoon', sub: 'Vrolijk en speels', img: IMG.cartoon, rand: 'border-koraal', pos: 'object-[50%_50%]' },
  ];

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-9 px-4 py-16 sm:px-6 md:py-20 lg:px-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className={h2Groot}>Drie stijlen. Jij kiest.</h2>
        <p className="m-0 text-lg text-grijs md:text-xl">Zie je meteen het verschil? Zo bedoelen we het.</p>
      </div>
      <div className="mx-auto grid w-full max-w-[960px] grid-cols-3 gap-3 sm:gap-8">
        {stijlen.map((s) => (
          <figure key={s.naam} className="m-0 flex flex-col items-center gap-3.5">
            <div className={`relative aspect-square w-full overflow-hidden rounded-full border-4 sm:border-[6px] ${s.rand}`}>
              <Image src={s.img} alt={`Stijl ${s.naam.toLowerCase()}`} fill sizes="(min-width: 768px) 300px, 33vw" className={`object-cover ${s.pos}`} />
            </div>
            <figcaption className="flex flex-col items-center gap-0.5 text-center">
              <span className="font-display text-lg font-extrabold leading-tight sm:text-[26px]">{s.naam}</span>
              <span className="text-[13px] leading-snug text-grijs sm:text-base">{s.sub}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* 7. Een echt boek */
function EchtBoek() {
  return (
    <section className="bg-lichtblauw">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <div className="flex flex-col gap-6">
          <h2 className={h2Groot}>Een echt boek. Niet op een scherm.</h2>
          <p className="m-0 text-lg text-inkt md:text-xl">
            Een harde kaft om elke avond opnieuw uit voor te lezen. Met de knuffel ernaast, natuurlijk.
          </p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-lg font-bold md:text-[19px]">
            <li className="flex items-center gap-3"><Vinkje /><span>Hardcover van 32 pagina&apos;s, in het Nederlands</span></li>
            <li className="flex items-center gap-3"><Vinkje /><span>Het verhaal past bij de leeftijd, van 2 tot 8</span></li>
            <li className="flex items-center gap-3"><Vinkje /><span>De PDF krijg je erbij, om te bewaren</span></li>
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_24px_50px_rgba(31,42,68,0.2)] rotate-2">
          <Image src={IMG.inHanden} alt="Het gedrukte Knuffelboek in handen, samen voorlezen op de bank" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

/* 9. Cadeaubon (nog niet te koop) */
function Cadeaubon() {
  return (
    <section id="cadeaubon" className="bg-blauw text-creme">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <div className="flex flex-col gap-6">
          <h2 className={h2Groot}>Geen foto van de knuffel? Geef een cadeaubon.</h2>
          <p className="m-0 text-lg md:text-xl">
            Voor opa&apos;s, oma&apos;s, ooms en tantes. De ontvanger maakt zelf een foto van de knuffel en kiest het verhaal. Ook als het te laat is voor een gedrukt boek.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-[18px] border-[3px] border-inkt bg-creme px-5 py-[18px] text-inkt">
              <span className="font-display text-[22px] font-extrabold leading-[1.1]">Direct in je mail</span>
              <span className="text-base text-grijs">Als PDF om te printen, ook op 24 december</span>
            </div>
            <div className="flex flex-col gap-1 rounded-[18px] border-[3px] border-inkt bg-geel px-5 py-[18px] text-inkt">
              <span className="font-display text-[22px] font-extrabold leading-[1.1]">Handgeschreven kaart</span>
              <span className="text-base text-grijs">Met jouw tekst, per post in een envelop</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[14px] bg-creme px-[18px] py-2.5 font-extrabold text-inkt">€29,95</span>
            <span className="rounded-[14px] bg-creme px-[18px] py-2.5 font-extrabold text-inkt">€39,95</span>
            <span className="rounded-[14px] bg-creme px-[18px] py-2.5 font-extrabold text-inkt">€50</span>
            <span className="inline-flex items-center gap-2 rounded-[20px] border-[3px] border-dashed border-geel px-6 py-3 text-lg font-extrabold text-geel">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Binnenkort te koop
            </span>
          </div>
          <p className="m-0 text-base">
            Wil je er een? Mail naar{' '}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Cadeaubon`} className="font-extrabold text-creme underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            , dan laten we het je weten zodra de cadeaubon te koop is.
          </p>
        </div>

        <figure className="m-0 flex rotate-2 flex-col gap-[18px] rounded-3xl border-4 border-inkt bg-creme p-6 text-inkt shadow-[0_24px_50px_rgba(0,0,0,0.2)] sm:rotate-3 sm:p-9">
          <figcaption className="sr-only">Voorbeeld van een cadeaubon</figcaption>
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-[26px] font-extrabold sm:text-[30px]">Knuffelboek</span>
            <SheepBadge size={64} />
          </div>
          <p className="m-0 inline-flex self-start rounded-full bg-koraal px-3.5 py-1.5 text-sm font-extrabold uppercase tracking-[1px]">Cadeaubon</p>
          <p className="m-0 font-hand text-[30px] font-bold leading-[1.15] text-blauw-diep sm:text-[34px]">
            Lieve Sam, maak een boek over jouw beer! Veel leesplezier, opa en oma
          </p>
          <p className="m-0 font-display text-5xl font-extrabold leading-none">€39,95</p>
          <p className="m-0 border-t-[3px] border-dashed border-lichtblauw pt-4 text-[15px] text-grijs-licht">
            Code: KB-XXXX-XXXX, in te wisselen op knuffelboek.nl
          </p>
        </figure>
      </div>
    </section>
  );
}

/* 10. Kerst en Sinterklaas */
function Feestdagen() {
  return (
    <section className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-7 px-4 pb-12 pt-16 sm:px-6 md:pt-20 lg:grid-cols-2 lg:px-10">
      <article className="flex flex-col gap-3.5 rounded-[28px] border-4 border-koraal bg-white p-6 sm:p-9">
        <p className="m-0 text-[15px] font-extrabold uppercase tracking-[2px] text-koraal-donker">Kerst, 25 december</p>
        <h3 className="m-0 font-display text-[clamp(32px,6vw,40px)] font-extrabold leading-none">Bestel vóór 30 november</h3>
        <p className="m-0 text-grijs">
          Dan ligt het gedrukte boek op tijd onder de boom. Tot 24 december kun je nog de PDF geven, en straks ook een cadeaubon.
        </p>
      </article>
      <article className="flex flex-col gap-3.5 rounded-[28px] border-4 border-blauw bg-white p-6 sm:p-9">
        <p className="m-0 text-[15px] font-extrabold uppercase tracking-[2px] text-blauw">Sinterklaas, 5 december</p>
        <h3 className="m-0 font-display text-[clamp(32px,6vw,40px)] font-extrabold leading-none">Stop een cadeaubon in de schoen</h3>
        <p className="m-0 text-grijs">
          Te laat voor een gedrukt boek? Met de bon maakt je kind samen met jou het eigen boek, met de eigen knuffel. De cadeaubon is binnenkort te koop.
        </p>
      </article>
    </section>
  );
}

/* 11. Vragen */
function Vragen() {
  const vragen = [
    { q: 'Hoe lang duurt het?', a: `Het voorproefje heb je binnen een paar minuten. Drukken en bezorgen: ${LEVERTIJD}.`, bg: 'bg-geel' },
    {
      q: 'Voor welke leeftijd is het?',
      a: 'Voor kinderen van 2 tot 8. Het verhaal past zich aan: van 2 tot 4 jaar korte zinnetjes en veel beeld, van 5 tot 8 jaar langere zinnen, ook om zelf te lezen.',
      bg: 'bg-lichtblauw',
    },
    { q: 'Welke knuffels werken?', a: 'Elke knuffel, van beer tot draak. Een scherpe foto bij daglicht werkt het best.', bg: 'bg-perzik' },
    { q: 'Wat gebeurt er met de foto?', a: 'Die gebruiken we alleen voor jouw boek en delen we niet.', bg: 'bg-salie-licht' },
    { q: 'Krijg ik de PDF erbij?', a: 'Ja. Bij een gedrukt boek zit de PDF erbij. Alleen de PDF kan ook, voor €10.', bg: 'bg-geel' },
    { q: 'Kan ik het terugsturen?', a: 'Nee, want het boek is speciaal voor jou gemaakt. Klopt er iets niet met de druk, dan lossen we het op.', bg: 'bg-lichtblauw' },
  ];

  return (
    <section id="faq" className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <h2 className={`${h2Groot} text-center`}>Vragen? Dit horen we vaak</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {vragen.map((v) => (
          <div key={v.q} className={`flex flex-col gap-2.5 rounded-3xl p-6 sm:p-7 ${v.bg}`}>
            <h3 className="m-0 font-display text-2xl font-extrabold">{v.q}</h3>
            <p className="m-0">{v.a}</p>
          </div>
        ))}
      </div>
      <p className="m-0 text-center font-bold">
        Meer vragen?{' '}
        <Link href="/faq" className="text-koraal-donker underline underline-offset-4 hover:text-koraal-diep">
          Bekijk alle vragen
        </Link>
      </p>
    </section>
  );
}

/* 12. Slot */
function Slot() {
  return (
    <section id="maak" className="bg-koraal text-inkt">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-[88px] lg:px-10">
        <SheepBadge size={128} border={5} />
        <h2 className="m-0 max-w-[760px] font-display text-[clamp(40px,8vw,64px)] font-extrabold leading-none [text-wrap:pretty]">
          Pak de knuffel. Wij doen de rest.
        </h2>
        <p className="m-0 max-w-[560px] text-lg md:text-xl">Het voorproefje is gratis. Betalen doe je pas als je het boek wilt hebben.</p>
        <a
          href={appUrl('slot')}
          className="rounded-[20px] bg-inkt px-10 py-5 text-[22px] font-extrabold text-creme no-underline transition-transform hover:-translate-y-0.5"
        >
          Maak je boek
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-clip text-[18px] leading-[1.5]">
      <Hero />
      <Marquee />
      <ZoWerktHet />
      <VideoPlek />
      <Voorbeelden />
      <Stijlen />
      <EchtBoek />
      <Pricing campaign="home" />
      <Cadeaubon />
      <Feestdagen />
      <Vragen />
      <Slot />
    </div>
  );
}

import { appUrl } from '@/lib/constants';

interface PricingProps {
  /** utm_campaign voor de knoppen (bijv. 'home' of 'prijzen') */
  campaign?: string;
  /** Kop als h1 (losse prijzenpagina) of h2 (homepage) */
  headingLevel?: 'h1' | 'h2';
}

/** "Wat kost het?": softcover, hardcover (het cadeau) en alleen digitaal. */
export default function Pricing({ campaign = 'home', headingLevel = 'h2' }: PricingProps) {
  const Kop = headingLevel;

  return (
    <section
      id="prijzen"
      className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pb-14 pt-16 sm:px-6 md:pb-[72px] md:pt-[88px] lg:px-10"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Kop className="m-0 font-display text-[clamp(38px,7vw,56px)] font-extrabold leading-none">Wat kost het?</Kop>
        <p className="m-0 text-lg text-grijs md:text-xl">Je betaalt pas als je het voorproefje hebt gezien.</p>
      </div>

      <div className="mx-auto grid w-full max-w-[560px] grid-cols-1 items-stretch gap-7 lg:max-w-none lg:grid-cols-3">
        {/* Softcover */}
        <article className="order-2 flex flex-col gap-[18px] overflow-hidden rounded-[28px] border-4 border-inkt bg-white pb-8 lg:order-none">
          <h3 className="m-0 bg-blauw px-6 py-3.5 sm:px-8 font-display text-2xl font-extrabold text-creme">Softcover</h3>
          <div className="flex flex-grow flex-col gap-[18px] px-6 sm:px-8">
            <p className="m-0 font-display text-[56px] font-extrabold leading-none">€29,95</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] text-grijs">
              <li>Zachte kaft, 32 pagina&apos;s</li>
              <li>Gedrukt en thuisbezorgd</li>
              <li>De PDF krijg je erbij</li>
            </ul>
            <a
              href={appUrl('prijzen-softcover', campaign)}
              className="mt-auto rounded-[18px] border-[3px] border-inkt px-6 py-3.5 text-center font-extrabold text-inkt no-underline transition-transform hover:-translate-y-0.5"
            >
              Kies softcover
            </a>
          </div>
        </article>

        {/* Hardcover: het cadeau */}
        <article className="order-1 flex flex-col gap-[18px] overflow-hidden rounded-[28px] border-4 border-inkt bg-white pb-8 shadow-[0_24px_50px_rgba(31,42,68,0.18)] lg:order-none lg:scale-[1.04]">
          <div className="flex items-center justify-between gap-3 bg-koraal px-6 py-3.5 sm:px-8">
            <h3 className="m-0 font-display text-2xl font-extrabold text-inkt">Hardcover</h3>
            <span className="rounded-full bg-inkt px-3 py-1.5 font-sans text-[13px] font-extrabold uppercase tracking-[1px] text-creme">
              Het cadeau
            </span>
          </div>
          <div className="flex flex-grow flex-col gap-[18px] px-6 sm:px-8">
            <p className="m-0 font-display text-[56px] font-extrabold leading-none">€39,95</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] text-grijs">
              <li>Harde kaft, stevig papier, 32 pagina&apos;s</li>
              <li>Gedrukt en thuisbezorgd</li>
              <li>De PDF krijg je erbij</li>
              <li>Extra exemplaar €19,95</li>
            </ul>
            <a
              href={appUrl('prijzen-hardcover', campaign)}
              className="mt-auto rounded-[18px] border-b-[5px] border-koraal-donker bg-koraal px-6 py-4 text-center font-extrabold text-inkt no-underline transition-transform hover:-translate-y-0.5"
            >
              Kies hardcover
            </a>
          </div>
        </article>

        {/* Alleen digitaal */}
        <article className="order-3 flex flex-col gap-[18px] overflow-hidden rounded-[28px] border-4 border-inkt bg-white pb-8 lg:order-none">
          <h3 className="m-0 bg-geel px-6 py-3.5 sm:px-8 font-display text-2xl font-extrabold text-inkt">Alleen digitaal</h3>
          <div className="flex flex-grow flex-col gap-[18px] px-6 sm:px-8">
            <p className="m-0 font-display text-[56px] font-extrabold leading-none">€10</p>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[17px] text-grijs">
              <li>Het hele boek als PDF, 32 pagina&apos;s</li>
              <li>Dezelfde dag in je mail</li>
              <li>Ook als het te laat is voor drukken</li>
            </ul>
            <a
              href={appUrl('prijzen-pdf', campaign)}
              className="mt-auto rounded-[18px] border-[3px] border-inkt px-6 py-3.5 text-center font-extrabold text-inkt no-underline transition-transform hover:-translate-y-0.5"
            >
              Kies PDF
            </a>
          </div>
        </article>
      </div>

      <p className="m-0 max-w-[720px] self-center text-center text-[15px] text-grijs">
        Elk boek wordt speciaal voor jou gemaakt, met jouw knuffel en namen. Daarom geldt er geen bedenktijd van 14 dagen. Is er iets mis met de druk? Mail ons, dan lossen we het op.
      </p>
    </section>
  );
}

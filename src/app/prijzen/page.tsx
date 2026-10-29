import { Metadata } from 'next';
import { Pricing, SheepBadge } from '@/components';
import { appUrl, LEVERTIJD } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Prijzen | Knuffelboek',
  description: 'Hardcover €39,95, softcover €29,95 of alleen de PDF voor €10. Bij een gedrukt boek krijg je de PDF erbij.',
};

export default function PrijzenPage() {
  return (
    <>
      <Pricing campaign="prijzen" headingLevel="h1" />

      <section className="bg-lichtblauw">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-10">
          <div className="flex flex-col gap-2 rounded-3xl bg-creme p-6">
            <h2 className="m-0 font-display text-2xl font-extrabold">Levertijd</h2>
            <p className="m-0 text-grijs">Het voorproefje heb je binnen een paar minuten. Drukken en bezorgen: {LEVERTIJD}.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl bg-creme p-6">
            <h2 className="m-0 font-display text-2xl font-extrabold">Extra exemplaar</h2>
            <p className="m-0 text-grijs">Nog een boek voor opa en oma? Een extra exemplaar van hetzelfde boek kost €19,95.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl bg-creme p-6">
            <h2 className="m-0 font-display text-2xl font-extrabold">Betalen</h2>
            <p className="m-0 text-grijs">Met iDEAL of creditcard, veilig via Stripe. Je betaalt pas als je het voorproefje hebt gezien.</p>
          </div>
        </div>
      </section>

      <section className="bg-koraal text-inkt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-10">
          <SheepBadge size={104} border={5} />
          <h2 className="m-0 font-display text-[clamp(36px,7vw,56px)] font-extrabold leading-none">Pak de knuffel. Wij doen de rest.</h2>
          <a
            href={appUrl('slot', 'prijzen')}
            className="rounded-[20px] bg-inkt px-10 py-5 text-[22px] font-extrabold text-creme no-underline transition-transform hover:-translate-y-0.5"
          >
            Maak je boek
          </a>
        </div>
      </section>
    </>
  );
}

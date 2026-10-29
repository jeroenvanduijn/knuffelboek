import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({ children, subtitle, centered = true }: SectionTitleProps) {
  return (
    <div className={`mb-10 lg:mb-14 ${centered ? 'text-center' : ''}`}>
      <h2 className="mb-4 font-display text-[clamp(32px,6vw,48px)] font-extrabold leading-none text-inkt">
        {children}
      </h2>
      {subtitle && <p className="mx-auto max-w-2xl text-lg text-grijs">{subtitle}</p>}
    </div>
  );
}

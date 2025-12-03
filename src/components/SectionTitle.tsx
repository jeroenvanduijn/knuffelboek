import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionTitle({ children, subtitle, centered = true }: SectionTitleProps) {
  return (
    <div className={`mb-10 lg:mb-14 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-light max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

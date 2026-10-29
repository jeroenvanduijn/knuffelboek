import Link from 'next/link';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  /** Externe link in een nieuw tabblad openen */
  newTab?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  newTab = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center text-center font-extrabold rounded-[18px] no-underline transition-transform duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5';

  const variantStyles = {
    primary: 'bg-koraal text-inkt border-b-4 border-koraal-donker',
    secondary: 'bg-geel text-inkt border-b-4 border-geel-donker',
    outline: 'bg-creme text-inkt border-[3px] border-inkt',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return (
        <a
          href={href}
          className={combinedStyles}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedStyles}>
      {children}
    </button>
  );
}

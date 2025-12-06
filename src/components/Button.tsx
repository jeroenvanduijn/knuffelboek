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
}: ButtonProps) {
  // Base styles - licht afgeronde hoeken (niet volledig rond)
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles met nieuwe brand kleuren
  const variantStyles = {
    // Primary: Abrikoos knop met nachtblauwe tekst
    primary: 'bg-abrikoos text-nachtblauw hover:bg-abrikoos-dark hover:shadow-lg hover:-translate-y-0.5',
    // Secondary: Pastelblauw knop met nachtblauwe tekst
    secondary: 'bg-pastelblauw text-nachtblauw hover:bg-pastelblauw/80 hover:shadow-lg hover:-translate-y-0.5',
    // Outline: Transparant met nachtblauwe rand
    outline: 'bg-transparent border-2 border-nachtblauw text-nachtblauw hover:bg-nachtblauw hover:text-wolwit',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    // External URLs (http/https) open in new tab
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={combinedStyles}>
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
    >
      {children}
    </button>
  );
}

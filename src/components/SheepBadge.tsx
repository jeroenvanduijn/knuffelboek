import Image from 'next/image';
import { LOGO_URL } from '@/lib/constants';

interface SheepBadgeProps {
  /** Doorsnede van de witte cirkel in px */
  size: number;
  /** Dikte van de donkere rand in px */
  border?: number;
  /** Alt-tekst; leeg = decoratief */
  alt?: string;
  className?: string;
  priority?: boolean;
}

/** Het schaapjeslogo in een witte cirkel met donkere rand, wiebelend (staat stil bij reduced motion). */
export default function SheepBadge({ size, border = 3, alt = '', className = '', priority = false }: SheepBadgeProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-inkt bg-white ${className}`}
      style={{ width: size, height: size, borderWidth: border, borderStyle: 'solid' }}
    >
      <Image
        src={LOGO_URL}
        alt={alt}
        width={Math.round(size * 0.88)}
        height={Math.round(size * 0.88)}
        className="kb-wiebel h-[88%] w-[88%] object-contain"
        priority={priority}
      />
    </span>
  );
}

interface SheepMascotProps {
  variant?: 'default' | 'book' | 'cloud' | 'camera' | 'sleeping' | 'happy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function SheepMascot({ variant = 'default', size = 'md', className = '' }: SheepMascotProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const baseSheep = (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Wool body - fluffy cloud shape */}
      <ellipse cx="50" cy="60" rx="32" ry="25" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Extra wool puffs */}
      <circle cx="25" cy="55" r="12" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="75" cy="55" r="12" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="35" cy="45" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="65" cy="45" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="50" cy="40" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face */}
      <ellipse cx="50" cy="35" rx="16" ry="14" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>

      {/* Ears */}
      <ellipse cx="32" cy="28" rx="6" ry="8" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-20 32 28)"/>
      <ellipse cx="68" cy="28" rx="6" ry="8" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(20 68 28)"/>
      <ellipse cx="33" cy="28" rx="3" ry="4" fill="#FFB786" transform="rotate(-20 33 28)"/>
      <ellipse cx="67" cy="28" rx="3" ry="4" fill="#FFB786" transform="rotate(20 67 28)"/>

      {/* Eyes - small and bead-like */}
      <circle cx="44" cy="33" r="3" fill="#1F2A44"/>
      <circle cx="56" cy="33" r="3" fill="#1F2A44"/>
      <circle cx="45" cy="32" r="1" fill="white"/>
      <circle cx="57" cy="32" r="1" fill="white"/>

      {/* Nose */}
      <ellipse cx="50" cy="40" rx="3" ry="2" fill="#1F2A44"/>

      {/* Mouth - gentle smile */}
      <path d="M 46 44 Q 50 47 54 44" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Legs */}
      <rect x="35" y="78" width="6" height="12" rx="3" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
      <rect x="59" y="78" width="6" height="12" rx="3" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
    </svg>
  );

  // Sheep holding a book
  const bookSheep = (
    <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Wool body */}
      <ellipse cx="50" cy="55" rx="30" ry="23" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="27" cy="50" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="73" cy="50" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="37" cy="42" r="9" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="63" cy="42" r="9" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="50" cy="38" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face */}
      <ellipse cx="50" cy="32" rx="15" ry="13" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>

      {/* Ears */}
      <ellipse cx="33" cy="25" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-20 33 25)"/>
      <ellipse cx="67" cy="25" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(20 67 25)"/>
      <ellipse cx="34" cy="25" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(-20 34 25)"/>
      <ellipse cx="66" cy="25" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(20 66 25)"/>

      {/* Eyes - looking at book */}
      <circle cx="44" cy="30" r="2.5" fill="#1F2A44"/>
      <circle cx="56" cy="30" r="2.5" fill="#1F2A44"/>
      <circle cx="45" cy="29" r="0.8" fill="white"/>
      <circle cx="57" cy="29" r="0.8" fill="white"/>

      {/* Nose & smile */}
      <ellipse cx="50" cy="36" rx="2.5" ry="1.5" fill="#1F2A44"/>
      <path d="M 46 40 Q 50 43 54 40" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Book */}
      <rect x="32" y="72" width="36" height="28" rx="2" fill="#A7C7E7" stroke="#1F2A44" strokeWidth="2"/>
      <line x1="50" y1="72" x2="50" y2="100" stroke="#1F2A44" strokeWidth="2"/>
      <rect x="35" y="76" width="12" height="2" rx="1" fill="#1F2A44" opacity="0.3"/>
      <rect x="35" y="81" width="10" height="2" rx="1" fill="#1F2A44" opacity="0.3"/>
      <rect x="53" y="76" width="12" height="2" rx="1" fill="#1F2A44" opacity="0.3"/>
      <rect x="53" y="81" width="10" height="2" rx="1" fill="#1F2A44" opacity="0.3"/>

      {/* Arms holding book */}
      <ellipse cx="30" cy="68" rx="5" ry="8" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
      <ellipse cx="70" cy="68" rx="5" ry="8" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
    </svg>
  );

  // Sheep on a cloud (loading state)
  const cloudSheep = (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Cloud */}
      <ellipse cx="60" cy="75" rx="45" ry="18" fill="white" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="30" cy="70" r="15" fill="white" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="90" cy="70" r="15" fill="white" stroke="#1F2A44" strokeWidth="2"/>
      <ellipse cx="60" cy="65" rx="25" ry="12" fill="white"/>

      {/* Sheep body - smaller for cloud */}
      <ellipse cx="60" cy="50" rx="22" ry="17" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="43" cy="47" r="8" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="77" cy="47" r="8" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="52" cy="40" r="7" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="68" cy="40" r="7" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="60" cy="36" r="8" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face */}
      <ellipse cx="60" cy="32" rx="12" ry="10" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>

      {/* Ears */}
      <ellipse cx="47" cy="26" rx="4" ry="6" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-20 47 26)"/>
      <ellipse cx="73" cy="26" rx="4" ry="6" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(20 73 26)"/>
      <ellipse cx="48" cy="26" rx="2" ry="3" fill="#FFB786" transform="rotate(-20 48 26)"/>
      <ellipse cx="72" cy="26" rx="2" ry="3" fill="#FFB786" transform="rotate(20 72 26)"/>

      {/* Closed eyes - dreamy */}
      <path d="M 54 30 Q 56 28 58 30" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 62 30 Q 64 28 66 30" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Nose & smile */}
      <ellipse cx="60" cy="35" rx="2" ry="1.2" fill="#1F2A44"/>
      <path d="M 57 38 Q 60 40 63 38" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );

  // Sheep looking at camera
  const cameraSheep = (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Wool body */}
      <ellipse cx="50" cy="60" rx="28" ry="22" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="27" cy="55" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="73" cy="55" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="37" cy="47" r="8" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="63" cy="47" r="8" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="50" cy="42" r="9" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face - tilted head curious */}
      <ellipse cx="50" cy="35" rx="14" ry="12" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(5 50 35)"/>

      {/* Ears */}
      <ellipse cx="34" cy="27" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-15 34 27)"/>
      <ellipse cx="66" cy="29" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(25 66 29)"/>
      <ellipse cx="35" cy="27" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(-15 35 27)"/>
      <ellipse cx="65" cy="29" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(25 65 29)"/>

      {/* Big curious eyes */}
      <circle cx="44" cy="33" r="4" fill="#1F2A44"/>
      <circle cx="56" cy="34" r="4" fill="#1F2A44"/>
      <circle cx="45.5" cy="31.5" r="1.5" fill="white"/>
      <circle cx="57.5" cy="32.5" r="1.5" fill="white"/>

      {/* Raised eyebrows - curious */}
      <path d="M 40 28 Q 44 26 48 28" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 52 29 Q 56 27 60 29" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Nose & smile */}
      <ellipse cx="50" cy="40" rx="2.5" ry="1.5" fill="#1F2A44"/>
      <path d="M 47 44 Q 50 46 53 44" stroke="#1F2A44" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Legs */}
      <rect x="37" y="76" width="5" height="10" rx="2.5" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
      <rect x="58" y="76" width="5" height="10" rx="2.5" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
    </svg>
  );

  // Sleeping sheep
  const sleepingSheep = (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Wool body - lying down */}
      <ellipse cx="50" cy="50" rx="35" ry="20" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="20" cy="48" r="12" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="80" cy="48" r="12" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="35" cy="38" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="65" cy="38" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="50" cy="35" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face - resting on paws */}
      <ellipse cx="50" cy="32" rx="14" ry="11" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>

      {/* Ears - relaxed */}
      <ellipse cx="34" cy="24" rx="5" ry="6" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-30 34 24)"/>
      <ellipse cx="66" cy="24" rx="5" ry="6" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(30 66 24)"/>
      <ellipse cx="35" cy="24" rx="2.5" ry="3" fill="#FFB786" transform="rotate(-30 35 24)"/>
      <ellipse cx="65" cy="24" rx="2.5" ry="3" fill="#FFB786" transform="rotate(30 65 24)"/>

      {/* Closed eyes - sleeping */}
      <path d="M 42 30 Q 45 28 48 30" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 52 30 Q 55 28 58 30" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Nose */}
      <ellipse cx="50" cy="36" rx="2" ry="1.2" fill="#1F2A44"/>

      {/* ZZZ */}
      <text x="70" y="18" fill="#A7C7E7" fontSize="10" fontWeight="bold">Z</text>
      <text x="78" y="12" fill="#A7C7E7" fontSize="8" fontWeight="bold">z</text>
      <text x="84" y="8" fill="#A7C7E7" fontSize="6" fontWeight="bold">z</text>
    </svg>
  );

  // Happy sheep
  const happySheep = (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
      {/* Wool body */}
      <ellipse cx="50" cy="60" rx="30" ry="24" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="25" cy="55" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="75" cy="55" r="11" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="35" cy="45" r="9" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="65" cy="45" r="9" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>
      <circle cx="50" cy="40" r="10" fill="#FFF9F1" stroke="#1F2A44" strokeWidth="2"/>

      {/* Face */}
      <ellipse cx="50" cy="35" rx="15" ry="13" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>

      {/* Ears */}
      <ellipse cx="33" cy="26" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(-20 33 26)"/>
      <ellipse cx="67" cy="26" rx="5" ry="7" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2" transform="rotate(20 67 26)"/>
      <ellipse cx="34" cy="26" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(-20 34 26)"/>
      <ellipse cx="66" cy="26" rx="2.5" ry="3.5" fill="#FFB786" transform="rotate(20 66 26)"/>

      {/* Happy closed eyes */}
      <path d="M 41 32 Q 44 30 47 32" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 53 32 Q 56 30 59 32" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Rosy cheeks */}
      <circle cx="38" cy="37" r="4" fill="#FFB786" opacity="0.5"/>
      <circle cx="62" cy="37" r="4" fill="#FFB786" opacity="0.5"/>

      {/* Nose & big smile */}
      <ellipse cx="50" cy="38" rx="2.5" ry="1.5" fill="#1F2A44"/>
      <path d="M 44 42 Q 50 48 56 42" stroke="#1F2A44" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Legs */}
      <rect x="36" y="78" width="5" height="10" rx="2.5" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
      <rect x="59" y="78" width="5" height="10" rx="2.5" fill="#F2E4CF" stroke="#1F2A44" strokeWidth="2"/>
    </svg>
  );

  const variants = {
    default: baseSheep,
    book: bookSheep,
    cloud: cloudSheep,
    camera: cameraSheep,
    sleeping: sleepingSheep,
    happy: happySheep,
  };

  return variants[variant];
}

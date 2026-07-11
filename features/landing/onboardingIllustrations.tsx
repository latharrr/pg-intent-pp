/**
 * Hand-coded approximations of the Figma onboarding mascots (flat-fill
 * characters + line detail), not pixel-exact traces of the exported PNGs.
 * Swap these for real exported SVG/PNG assets if pixel-perfect fidelity
 * matters more than shipping now.
 */

const STAR_PATH =
  "M100,15 L117,58 L160,40 L142,83 L185,100 L142,117 L160,160 L117,142 L100,185 L83,142 L40,160 L58,117 L15,100 L58,83 L40,40 L83,58 Z";

const line = { stroke: "#1a1a1a", strokeWidth: 3.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function BlobShocked({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      {/* surprise marks */}
      <path d="M45,55 L38,38 M55,50 L52,32 M65,52 L68,35" {...line} />
      <path d="M155,55 L162,38 M145,50 L148,32 M135,52 L132,35" {...line} />
      {/* head */}
      <ellipse cx="100" cy="115" rx="62" ry="58" fill="#A8D3EA" stroke="#1a1a1a" strokeWidth="3.5" />
      {/* hands clutching head */}
      <path d="M52,90 C40,80 34,68 38,58" {...line} />
      <circle cx="37" cy="57" r="4" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M148,90 C160,80 166,68 162,58" {...line} />
      <circle cx="163" cy="57" r="4" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />
      {/* eyes */}
      <ellipse cx="78" cy="112" rx="17" ry="19" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3.5" />
      <ellipse cx="122" cy="112" rx="17" ry="19" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3.5" />
      <circle cx="80" cy="116" r="7" fill="#1a1a1a" />
      <circle cx="120" cy="116" r="7" fill="#1a1a1a" />
      {/* mouth */}
      <ellipse cx="100" cy="145" rx="7" ry="9" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />
      {/* legs */}
      <path d="M85,172 L82,190 M115,172 L118,190" {...line} />
    </svg>
  );
}

export function StarWorried({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <path d={STAR_PATH} fill="#F0A878" stroke="#1a1a1a" strokeWidth="3.5" strokeLinejoin="round" />
      {/* worried eyebrows + eyes */}
      <path d="M68,92 Q78,82 90,90 M110,90 Q122,82 132,92" {...line} />
      <path d="M72,100 Q80,96 88,100" {...line} />
      <path d="M112,100 Q120,96 128,100" {...line} />
      {/* frown */}
      <path d="M85,128 Q100,118 115,128" {...line} />
      {/* sweat drops */}
      <path d="M150,95 q4,8 0,14 q-4,-2 -4,-7 q0,-5 4,-7z" fill="#5EA8D8" />
      <path d="M158,112 q4,8 0,14 q-4,-2 -4,-7 q0,-5 4,-7z" fill="#5EA8D8" />
      {/* dangling limbs */}
      <path d="M60,150 Q50,168 40,172" {...line} />
      <circle cx="38" cy="173" r="4.5" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M140,150 Q150,168 160,172" {...line} />
      <circle cx="162" cy="173" r="4.5" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M100,155 L100,178" {...line} />
    </svg>
  );
}

export function StarSad({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <path d={STAR_PATH} fill="#F0B94A" stroke="#1a1a1a" strokeWidth="3.5" strokeLinejoin="round" />
      {/* droopy sleepy eyes */}
      <path d="M68,102 Q80,112 92,102" {...line} />
      <path d="M108,102 Q120,112 132,102" {...line} />
      {/* small frown */}
      <path d="M90,132 Q100,127 110,132" {...line} />
      {/* dangling limp limbs */}
      <path d="M62,148 Q45,158 42,182" {...line} />
      <circle cx="41" cy="185" r="4.5" fill="#F0B94A" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M100,152 Q98,168 96,188" {...line} />
      <circle cx="95" cy="191" r="4.5" fill="#F0B94A" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M138,148 Q155,158 158,182" {...line} />
      <circle cx="159" cy="185" r="4.5" fill="#F0B94A" stroke="#1a1a1a" strokeWidth="3" />
      {/* tiny moths */}
      <path d="M155,60 q-6,-6 -10,0 q4,6 10,0z M155,60 q6,-6 10,0 q-4,6 -10,0z" fill="#9aa" opacity="0.7" />
      <path d="M62,178 q-5,-5 -8,0 q3,5 8,0z M62,178 q5,-5 8,0 q-3,5 -8,0z" fill="#9aa" opacity="0.7" />
    </svg>
  );
}

export function StarHunter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <path d={STAR_PATH} fill="#B9A2E8" stroke="#1a1a1a" strokeWidth="3.5" strokeLinejoin="round" />
      {/* angry eyebrows */}
      <path d="M68,98 L90,106 M132,98 L110,106" {...line} strokeWidth="4" />
      <path d="M74,110 Q82,106 90,110" {...line} />
      <path d="M110,110 Q118,106 126,110" {...line} />
      {/* frown */}
      <path d="M88,132 Q100,126 112,132" {...line} />
      {/* backpack straps */}
      <path d="M78,120 L70,168 M122,120 L130,168" {...line} strokeWidth="5" stroke="#8a7256" />
      <rect x="62" y="150" width="16" height="14" rx="3" fill="#a8875f" stroke="#1a1a1a" strokeWidth="2.5" />
      <rect x="122" y="150" width="16" height="14" rx="3" fill="#a8875f" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* rifle */}
      <path d="M55,168 L150,158" stroke="#5c4a3d" strokeWidth="6" strokeLinecap="round" />
      <path d="M140,158 L150,148" stroke="#5c4a3d" strokeWidth="5" strokeLinecap="round" />
      {/* boots */}
      <path d="M85,175 L82,192 M115,175 L118,192" {...line} />
      <ellipse cx="80" cy="195" rx="8" ry="5" fill="#5c4a3d" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="120" cy="195" rx="8" ry="5" fill="#5c4a3d" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* hunter hat */}
      <ellipse cx="100" cy="52" rx="42" ry="12" fill="#a8875f" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M68,52 Q70,22 100,20 Q130,22 132,52 Z" fill="#a8875f" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M128,26 L142,10 M142,10 L138,20 M142,10 L133,16" stroke="#c23b23" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function CloudsDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 430 140" preserveAspectRatio="none" aria-hidden className={className}>
      <path
        d="M-10,140 L-10,90 Q10,60 35,80 Q55,40 90,65 Q115,30 150,60 Q180,35 210,62 Q245,35 275,65 Q305,40 335,68 Q365,45 390,75 Q410,60 440,85 L440,140 Z"
        fill="#F2D24B"
      />
      <path
        d="M-10,140 L-10,105 Q15,78 45,98 Q68,62 100,85 Q128,55 160,82 Q190,60 222,86 Q252,60 285,88 Q315,65 345,90 Q375,72 440,100 L440,140 Z"
        fill="#C08FA0"
      />
    </svg>
  );
}

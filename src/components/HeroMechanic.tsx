/**
 * Hero mechanic mascot — a realistic-style doorstep technician standing beside
 * the hero headline (badge + both headline lines), with:
 *  - navy "RIDE N CARE" cap with an OVERSIZED white front plate: the brand
 *    name renders large, with a pulsing neon under-glow, a light halo on the
 *    letters and twinkling stars around the plate
 *  - a combination spanner in each hand (the raised one gently turns a bolt)
 *  - uniform details: neon shoulder piping, RNC chest patch, pocket + pen
 *  - magic UX: soft neon aura, floating sparkle motes, blinking eyes, gentle
 *    whole-figure float — all transform/opacity-only and disabled under
 *    prefers-reduced-motion (src/styles.css).
 *
 * Pure inline SVG: no image requests, no layout shift, crisp at any DPR.
 * Decorative (aria-hidden) — the headline carries the meaning.
 */
export function HeroMechanic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 264"
      aria-hidden="true"
      focusable="false"
      className={`mech-float h-24 w-auto shrink-0 drop-shadow-[0_12px_26px_rgba(2,10,26,0.65)] sm:h-48 md:h-56 ${className}`}
    >
      <defs>
        <radialGradient id="mech-skin" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f4cba0" />
          <stop offset="55%" stopColor="#e8b98f" />
          <stop offset="100%" stopColor="#d9a67c" />
        </radialGradient>
        <linearGradient id="mech-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f4f9" />
          <stop offset="50%" stopColor="#b7c3d4" />
          <stop offset="100%" stopColor="#7e8ea6" />
        </linearGradient>
        <linearGradient id="mech-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#274a85" />
          <stop offset="100%" stopColor="#16305c" />
        </linearGradient>
        <linearGradient id="mech-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20447c" />
          <stop offset="60%" stopColor="#183562" />
          <stop offset="100%" stopColor="#122a52" />
        </linearGradient>
        <radialGradient id="mech-aura">
          <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.3" />
          <stop offset="55%" stopColor="var(--neon)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mech-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="mech-cap-clip">
          <path d="M86 74 Q86 34 120 34 Q154 34 154 74 Q154 79 149 79 L91 79 Q86 79 86 74 Z" />
        </clipPath>
      </defs>

      {/* soft neon aura + ground shadow */}
      <circle cx="120" cy="126" r="104" fill="url(#mech-aura)" className="mech-aura" />
      <ellipse cx="120" cy="250" rx="64" ry="7" fill="rgb(2 10 26 / 0.4)" />

      {/* torso — branded uniform */}
      <path d="M76 254 L76 170 Q76 140 102 134 L138 134 Q164 140 164 170 L164 254 Z" fill="url(#mech-shirt)" stroke="#0e2148" strokeWidth="1" />
      <path d="M78 152 Q120 138 162 152" stroke="var(--neon)" strokeWidth="1.6" opacity="0.55" fill="none" />
      {/* collar + undershirt */}
      <path d="M102 134 L120 154 L138 134 L138 141 L120 161 L102 141 Z" fill="#0f2547" />
      <path d="M105 136 L120 154 L135 136 Q120 147 105 136 Z" fill="var(--neon)" opacity="0.18" />
      {/* placket + buttons */}
      <rect x="116.5" y="154" width="7" height="100" rx="2" fill="#0f2547" />
      <circle cx="120" cy="170" r="1.8" fill="#9db4d8" />
      <circle cx="120" cy="194" r="1.8" fill="#9db4d8" />
      <circle cx="120" cy="218" r="1.8" fill="#9db4d8" />
      {/* RNC chest patch + pocket with neon pen */}
      <rect x="136" y="162" width="24" height="15" rx="3" fill="#0b1a33" stroke="#2a4a7d" strokeWidth="0.8" />
      <text x="148" y="173" textAnchor="middle" fontSize="8" fontWeight="700" fill="#67e8f9" style={{ fontFamily: "var(--font-display)" }}>
        RNC
      </text>
      <rect x="82" y="162" width="20" height="17" rx="2.5" fill="none" stroke="#33517f" strokeWidth="1.2" />
      <rect x="85" y="156" width="3.5" height="10" rx="1.5" fill="var(--neon)" />

      {/* right arm (viewer left) — raised, holding the big spanner */}
      <g className="mech-arm">
        <path d="M84 150 Q64 170 74 198" stroke="#16305c" strokeWidth="17" strokeLinecap="round" fill="none" />
        <circle cx="74" cy="198" r="10" fill="#0f2547" />
        <circle cx="76" cy="204" r="9" fill="url(#mech-skin)" />
        <g transform="rotate(-28 76 204)">
          <rect x="72.5" y="146" width="9" height="58" rx="3" fill="url(#mech-steel)" />
          <path d="M68 150 L77 138 L86 150 L86 156 L80 152 L77 156 L74 152 L68 156 Z" fill="url(#mech-steel)" stroke="#66788f" strokeWidth="0.6" />
          <circle cx="77" cy="206" r="11" fill="url(#mech-steel)" stroke="#66788f" strokeWidth="0.6" />
          <circle cx="77" cy="206" r="5.5" fill="#101f38" />
          <rect x="74.8" y="152" width="2" height="48" rx="1" fill="#ffffff" opacity="0.35" />
        </g>
      </g>

      {/* left arm (viewer right) — steady, small spanner */}
      <g className="mech-arm-b">
        <path d="M156 150 Q176 172 166 200" stroke="#16305c" strokeWidth="17" strokeLinecap="round" fill="none" />
        <circle cx="166" cy="200" r="10" fill="#0f2547" />
        <circle cx="163" cy="207" r="9" fill="url(#mech-skin)" />
        <g transform="rotate(36 163 207)">
          <rect x="159.8" y="178" width="7" height="34" rx="2.5" fill="url(#mech-steel)" />
          <path d="M155 182 L163.3 170 L171.5 182 L171.5 186 L166 182.5 L163.3 185 L160.5 182.5 L155 186 Z" fill="url(#mech-steel)" stroke="#66788f" strokeWidth="0.6" />
          <rect x="161.4" y="182" width="1.8" height="28" rx="0.9" fill="#ffffff" opacity="0.35" />
        </g>
      </g>

      {/* head */}
      <rect x="110" y="110" width="20" height="28" rx="7" fill="#d9a67c" />
      <ellipse cx="120" cy="90" rx="31" ry="33" fill="url(#mech-skin)" />
      <ellipse cx="120" cy="112" rx="20" ry="9" fill="#d9a67c" opacity="0.55" />
      <path d="M98 100 Q120 124 142 100 Q142 116 120 122 Q98 116 98 100 Z" fill="#3a2a1a" opacity="0.1" />
      <circle cx="88" cy="92" r="5.5" fill="#e8b98f" stroke="#c99872" strokeWidth="0.8" />
      <circle cx="152" cy="92" r="5.5" fill="#e8b98f" stroke="#c99872" strokeWidth="0.8" />
      {/* brows + eyes (lids blink via CSS) */}
      <path d="M100 80 Q108 76 116 80" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M124 80 Q132 76 140 80" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="108" cy="89" rx="4.6" ry="5.2" fill="#fdfdfd" />
      <ellipse cx="132" cy="89" rx="4.6" ry="5.2" fill="#fdfdfd" />
      <circle cx="108" cy="89.5" r="2.6" fill="#27436e" />
      <circle cx="132" cy="89.5" r="2.6" fill="#27436e" />
      <circle cx="108" cy="89.5" r="1.2" fill="#0d1524" />
      <circle cx="132" cy="89.5" r="1.2" fill="#0d1524" />
      <circle cx="109" cy="88" r="0.7" fill="#ffffff" />
      <circle cx="133" cy="88" r="0.7" fill="#ffffff" />
      <rect x="103" y="83.5" width="10.2" height="11" rx="5" fill="#e8b98f" className="mech-lid" />
      <rect x="126.8" y="83.5" width="10.2" height="11" rx="5" fill="#e8b98f" className="mech-lid" />
      {/* nose + smile */}
      <path d="M120 92 L117 101 Q120 104 123 101 Z" fill="#e0a87e" />
      <path d="M108 110 Q120 119 132 110" stroke="#8a4f33" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M112 114 Q120 118 128 114" stroke="#c99872" strokeWidth="1" opacity="0.6" fill="none" />

      {/* RIDE N CARE cap — taller dome so the name plate reads big */}
      <path d="M86 74 Q86 34 120 34 Q154 34 154 74 Q154 79 149 79 L91 79 Q86 79 86 74 Z" fill="url(#mech-cap)" stroke="#0c1c3a" strokeWidth="0.8" />
      <path d="M120 34 L120 79 M103 39 Q101 56 101 79 M137 39 Q139 56 137 79" stroke="#0c1c3a" strokeWidth="0.7" opacity="0.45" fill="none" />
      {/* pulsing neon under-glow behind the name plate (opacity-only) */}
      <rect x="88" y="50" width="64" height="20" rx="5" fill="var(--neon)" className="mech-name-glow" />
      {/* oversized white name plate */}
      <rect x="91" y="52" width="58" height="16" rx="4" fill="#f4f8ff" stroke="#c8d6ea" strokeWidth="0.8" />
      <text
        x="120"
        y="63.5"
        textAnchor="middle"
        fontSize="8.8"
        fontWeight="700"
        fill="#0f2a54"
        letterSpacing="0.2"
        textLength="50"
        lengthAdjust="spacingAndGlyphs"
        className="mech-plate-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        RIDE N CARE
      </text>
      <rect x="86.5" y="56.5" width="4" height="7.5" rx="1" fill="var(--neon)" opacity="0.8" />
      <rect x="149.5" y="56.5" width="4" height="7.5" rx="1" fill="var(--neon)" opacity="0.8" />
      <path d="M86 77 Q120 93 154 77 Q154 86 120 96 Q86 86 86 77 Z" fill="#0d1f44" stroke="#0a1830" strokeWidth="0.6" />
      <circle cx="120" cy="36" r="3.2" fill="var(--neon)" stroke="#0a1830" strokeWidth="0.8" />
      {/* travelling shine, clipped to the cap dome */}
      <g clipPath="url(#mech-cap-clip)">
        <rect x="58" y="30" width="26" height="52" fill="url(#mech-shine)" transform="skewX(-18)" className="mech-cap-shine" />
      </g>
      {/* twinkling stars around the brand name */}
      <g transform="translate(87 48)">
        <path d="M0 -3.4 L1 -1 L3.4 0 L1 1 L0 3.4 L-1 1 L-3.4 0 L-1 -1 Z" fill="#e0fbff" className="mech-name-spark" />
      </g>
      <g transform="translate(154 50)">
        <path d="M0 -2.8 L0.85 -0.85 L2.8 0 L0.85 0.85 L0 2.8 L-0.85 0.85 L-2.8 0 L-0.85 -0.85 Z" fill="#e0fbff" className="mech-name-spark" style={{ animationDelay: "0.7s" }} />
      </g>
      <g transform="translate(133 30)">
        <path d="M0 -2.4 L0.7 -0.7 L2.4 0 L0.7 0.7 L0 2.4 L-0.7 0.7 L-2.4 0 L-0.7 -0.7 Z" fill="#a5f3fc" className="mech-name-spark" style={{ animationDelay: "1.4s" }} />
      </g>

      {/* sparkle motes around the spanner + shoulders */}
      <circle cx="66" cy="136" r="2" fill="#ffd76b" className="mech-spark" />
      <circle cx="59" cy="147" r="1.6" fill="#fff3bf" className="mech-spark" style={{ animationDelay: "0.5s" }} />
      <circle cx="73" cy="127" r="1.5" fill="#ffd76b" className="mech-spark" style={{ animationDelay: "1s" }} />
      <circle cx="172" cy="92" r="1.6" fill="var(--neon)" className="mech-spark" style={{ animationDelay: "0.8s" }} />
      <circle cx="70" cy="76" r="1.5" fill="var(--neon)" className="mech-spark" style={{ animationDelay: "1.3s" }} />
    </svg>
  );
}

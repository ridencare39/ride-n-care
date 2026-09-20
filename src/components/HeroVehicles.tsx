/**
 * Hero vehicle parade: 7 stylised, model-flavoured vehicles cruising across
 * the hero forever on a transparent background (no photos, no road band):
 *
 *   Top → bottom lanes:
 *     1. Honda City–style sedan        (silver)
 *     2. KTM-style naked sportbike      (orange)
 *     3. Mahindra Thar–style off-roader (green)
 *     4. Activa-style scooter           (red)
 *     5. Verna-style fastback           (steel blue)
 *     6. Royal Enfield–style classic    (olive + chrome)
 *     7. Generic SUV crossover          (pearl white)
 *
 * All slide left → right, loop with negative delays and staggered durations,
 * so 2–3 vehicles are always on screen. Copy sits above (z-10 in the page).
 *
 * - Pure inline SVG + CSS animations: no image requests, no JS loop, no layout
 *   shift. Only transform/opacity animate (compositor-friendly).
 * - Reduced motion: everything renders parked and static (src/styles.css).
 */

/** Unique-enough gradient id per body colour so defs never collide. */
const gid = (body: string, kind: string) => `${kind}-${body.slice(1)}`;

/** Vertical body shading: lighter roofline → deeper sill. */
function BodyGradient({ id, body }: { id: string; body: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="35%" stopColor={body} />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
      </linearGradient>
    </defs>
  );
}

function GlassGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3b5a86" />
        <stop offset="55%" stopColor="#16305c" />
        <stop offset="100%" stopColor="#0b1c38" />
      </linearGradient>
    </defs>
  );
}

/** Alloy wheel: tyre, rim ring, 5 spokes, hub. */
function AlloyWheel({ cx, cy, r = 17 }: { cx: number; cy: number; r?: number }) {
  const spokes = [0, 72, 144, 216, 288]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `M${(cx + Math.cos(rad) * r * 0.28).toFixed(1)} ${(cy + Math.sin(rad) * r * 0.28).toFixed(1)} L${(cx + Math.cos(rad) * r * 0.72).toFixed(1)} ${(cy + Math.sin(rad) * r * 0.72).toFixed(1)}`;
    })
    .join(" ");
  return (
    <g className="rnc-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#0b1830" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="#aab6c8" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="var(--neon)" strokeWidth="2.6" />
      <path d={spokes} stroke="#d7dee8" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="var(--neon)" />
    </g>
  );
}

/** Wire-spoke wheel for the classic bike; chunky tread wheel for off-roaders. */
function WireWheel({ cx, cy, r = 24 }: { cx: number; cy: number; r?: number }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return `M${cx} ${cy} L${(cx + Math.cos(a) * r * 0.85).toFixed(1)} ${(cy + Math.sin(a) * r * 0.85).toFixed(1)}`;
  }).join(" ");
  return (
    <g className="rnc-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#0b1830" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="var(--neon)" strokeWidth="2.6" />
      <path d={spokes} stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" />
      <circle cx={cx} cy={cy} r={r * 0.13} fill="var(--neon)" />
    </g>
  );
}

function KnobbyWheel({ cx, cy, r = 23 }: { cx: number; cy: number; r?: number }) {
  const lugs = Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * r * 0.88;
    const y1 = cy + Math.sin(a) * r * 0.88;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join(" ");
  return (
    <g className="rnc-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#0b1830" />
      <path d={lugs} stroke="#39465c" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill="none" stroke="#aab6c8" strokeWidth="2.4" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="none" stroke="var(--neon)" strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r={r * 0.12} fill="var(--neon)" />
    </g>
  );
}

/** Honda City–style three-box sedan with grille, mirrors, doors. */
function SedanSvg({ body }: { body: string }) {
  const g = gid(body, "sedan");
  const w = gid(body, "glass");
  return (
    <svg viewBox="0 0 280 105" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <GlassGradient id={w} />
      <polygon points="252,52 274,42 274,66" fill="var(--neon)" className="rnc-beam" />
      {/* body */}
      <path d="M18 70 Q16 54 34 50 L92 46 Q104 30 126 29 L152 29 Q168 31 180 46 L224 50 Q252 54 254 64 L252 70 Q250 74 242 74 L226 74 A26 26 0 0 0 174 74 L106 74 A26 26 0 0 0 54 74 L28 74 Q18 74 18 70 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* greenhouse */}
      <path d="M130 40 Q138 31 150 31 L158 31 L168 44 L130 44 Z" fill={`url(#${w})`} />
      <path d="M98 44 Q108 33 122 31 L122 44 Z" fill={`url(#${w})`} />
      <path d="M104 36 L114 33" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
      {/* doors + handles */}
      <path d="M112 46 L112 70 M160 46 L160 70" stroke="rgba(0,0,0,0.25)" strokeWidth="1.4" />
      <rect x="118" y="50" width="10" height="2.4" rx="1.2" fill="rgba(255,255,255,0.65)" />
      <rect x="166" y="50" width="10" height="2.4" rx="1.2" fill="rgba(255,255,255,0.65)" />
      {/* mirrors */}
      <path d="M96 46 L90 42" stroke={body} strokeWidth="3" strokeLinecap="round" />
      {/* grille + bumper */}
      <rect x="240" y="54" width="14" height="8" rx="2" fill="rgba(0,0,0,0.35)" />
      <path d="M20 68 L252 68" stroke="rgba(0,0,0,0.3)" strokeWidth="1.6" />
      {/* lights */}
      <rect x="244" y="50" width="10" height="5" rx="2.5" fill="var(--neon)" />
      <rect x="19" y="54" width="9" height="4.5" rx="2" fill="#ff5470" opacity="0.9" />
      <AlloyWheel cx={79} cy={74} />
      <AlloyWheel cx={201} cy={74} />
      <ellipse cx="136" cy="97" rx="86" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** Verna-style fastback with sweeping roofline. */
function FastbackSvg({ body }: { body: string }) {
  const g = gid(body, "fast");
  const w = gid(body, "glass");
  return (
    <svg viewBox="0 0 280 105" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <GlassGradient id={w} />
      <polygon points="252,52 274,42 274,66" fill="var(--neon)" className="rnc-beam" />
      <path d="M18 70 Q16 54 34 50 L98 46 Q116 26 146 26 L162 26 Q182 30 196 46 Q214 52 232 56 Q254 60 254 66 L252 70 Q250 74 242 74 L226 74 A26 26 0 0 0 174 74 L106 74 A26 26 0 0 0 54 74 L28 74 Q18 74 18 70 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <path d="M132 38 Q140 30 152 30 L158 30 Q168 34 174 42 L132 42 Z" fill={`url(#${w})`} />
      <path d="M102 44 Q112 32 126 30 L126 44 Z" fill={`url(#${w})`} />
      <path d="M108 38 L118 34" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M118 46 L118 70 M164 44 L164 70" stroke="rgba(0,0,0,0.25)" strokeWidth="1.4" />
      <rect x="124" y="50" width="10" height="2.4" rx="1.2" fill="rgba(255,255,255,0.65)" />
      <rect x="170" y="50" width="10" height="2.4" rx="1.2" fill="rgba(255,255,255,0.65)" />
      <path d="M100 46 L94 42" stroke={body} strokeWidth="3" strokeLinecap="round" />
      <rect x="240" y="56" width="14" height="7" rx="2" fill="rgba(0,0,0,0.35)" />
      <rect x="244" y="50" width="10" height="5" rx="2.5" fill="var(--neon)" />
      <rect x="19" y="54" width="9" height="4.5" rx="2" fill="#ff5470" opacity="0.9" />
      <AlloyWheel cx={79} cy={74} />
      <AlloyWheel cx={201} cy={74} />
      <ellipse cx="136" cy="97" rx="86" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** Thar-style boxy off-roader: flat roof, spare wheel, round lamps, snorkel. */
function OffroaderSvg({ body }: { body: string }) {
  const g = gid(body, "thar");
  const w = gid(body, "glass");
  return (
    <svg viewBox="0 0 290 115" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <GlassGradient id={w} />
      <polygon points="262,54 284,44 284,68" fill="var(--neon)" className="rnc-beam" />
      {/* snorkel */}
      <path d="M60 40 L60 22 Q60 18 66 18 L72 18 Q76 18 76 22 L76 40" fill="rgba(0,0,0,0.3)" />
      {/* body */}
      <path d="M18 84 L18 52 Q18 44 28 44 L44 44 L52 26 Q54 22 60 22 L178 22 Q184 22 186 26 L194 44 L250 44 Q262 44 262 54 L262 80 Q262 84 254 84 L240 84 A26 26 0 0 0 188 84 L110 84 A26 26 0 0 0 58 84 L26 84 Q18 84 18 84 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* roof + windows */}
      <path d="M54 26 Q56 22 62 22 L176 22 Q182 22 184 26 L188 38 L58 38 Z" fill="rgba(0,0,0,0.35)" />
      <path d="M62 42 L70 30 L112 30 L112 42 Z" fill={`url(#${w})`} />
      <path d="M120 30 L170 30 Q176 30 178 34 L182 42 L120 42 Z" fill={`url(#${w})`} />
      <path d="M120 46 L120 80 M186 46 L186 80" stroke="rgba(0,0,0,0.3)" strokeWidth="1.6" />
      <rect x="128" y="52" width="12" height="2.6" rx="1.3" fill="rgba(255,255,255,0.65)" />
      <rect x="196" y="52" width="12" height="2.6" rx="1.3" fill="rgba(255,255,255,0.65)" />
      {/* fender + round lamp */}
      <path d="M24 52 L36 40" stroke="rgba(255,255,255,0.45)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="62" r="11" fill="#0b1830" stroke="#aab6c8" strokeWidth="2" />
      <circle cx="30" cy="62" r="5.5" fill="var(--neon)" />
      {/* grille + spare */}
      <rect x="248" y="56" width="12" height="10" rx="2" fill="rgba(0,0,0,0.35)" />
      <circle cx="264" cy="34" r="0" />
      <circle cx="256" cy="34" r="13" fill="#0b1830" stroke="#aab6c8" strokeWidth="2" />
      <KnobbyWheel cx={85} cy={84} r={24} />
      <KnobbyWheel cx={214} cy={84} r={24} />
      <ellipse cx="140" cy="108" rx="90" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** SUV crossover: roof rails, hatch, cladding. */
function SuvSvg({ body }: { body: string }) {
  const g = gid(body, "suv");
  const w = gid(body, "glass");
  return (
    <svg viewBox="0 0 290 115" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <GlassGradient id={w} />
      <polygon points="262,54 284,44 284,68" fill="var(--neon)" className="rnc-beam" />
      <path d="M18 78 Q16 60 32 56 L50 52 Q60 32 82 30 L192 30 Q208 32 218 48 L238 52 Q262 56 264 66 L262 74 Q260 78 252 78 L238 78 A26 26 0 0 0 186 78 L108 78 A26 26 0 0 0 56 78 L30 78 Q18 78 18 78 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M88 44 Q96 38 108 38 L120 38 L120 52 L88 52 Z" fill={`url(#${w})`} />
      <path d="M128 38 L162 38 Q174 40 182 50 L128 50 Z" fill={`url(#${w})`} />
      <path d="M94 44 L104 40" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M124 52 L124 76 M186 50 L186 76" stroke="rgba(0,0,0,0.22)" strokeWidth="1.4" />
      <rect x="130" y="56" width="11" height="2.4" rx="1.2" fill="rgba(0,0,0,0.35)" />
      <rect x="192" y="56" width="11" height="2.4" rx="1.2" fill="rgba(0,0,0,0.35)" />
      {/* roof rails */}
      <path d="M76 26 L200 26" stroke="#8fa2b8" strokeWidth="3.4" strokeLinecap="round" />
      {/* cladding */}
      <path d="M20 72 L262 72" stroke="rgba(0,0,0,0.28)" strokeWidth="3" />
      <rect x="252" y="54" width="11" height="6" rx="2" fill="rgba(0,0,0,0.35)" />
      <rect x="255" y="50" width="10" height="5" rx="2.5" fill="var(--neon)" />
      <rect x="19" y="56" width="9" height="4.5" rx="2" fill="#ff5470" opacity="0.9" />
      <KnobbyWheel cx={81} cy={78} r={23} />
      <KnobbyWheel cx={207} cy={78} r={23} />
      <ellipse cx="140" cy="104" rx="90" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** KTM-style naked sportbike: trellis frame, engine fins, high tail. */
function SportbikeSvg({ body }: { body: string }) {
  const g = gid(body, "ktm");
  return (
    <svg viewBox="0 0 230 115" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <polygon points="160,44 184,36 172,58" fill="var(--neon)" className="rnc-beam" />
      <WireWheel cx={52} cy={82} r={26} />
      <WireWheel cx={176} cy={82} r={26} />
      {/* swingarm + fork */}
      <path d="M98 88 L150 88" stroke="#22314f" strokeWidth="6" strokeLinecap="round" />
      <path d="M152 48 L174 78" stroke="#dfe9ff" strokeWidth="5.5" strokeLinecap="round" />
      {/* engine block with fins */}
      <rect x="96" y="60" width="30" height="17" rx="3" fill="#16233f" />
      <path d="M100 64 L122 64 M100 68 L122 68 M100 72 L122 72" stroke="#33456b" strokeWidth="1.6" />
      {/* trellis frame hint */}
      <path d="M92 58 L128 52 M92 66 L128 60" stroke="var(--neon)" strokeWidth="2" opacity="0.7" />
      {/* shrouds + tank + tail */}
      <path d="M32 60 L76 52 Q86 34 110 32 L134 35 L146 45 L130 55 L96 57 Q80 57 76 60 L52 66 Q34 66 32 60 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M38 56 L90 49 L100 40 L112 41 L100 55 L52 62 Q38 60 38 56 Z" fill="rgba(0,0,0,0.35)" />
      <path d="M112 41 L138 36" stroke="var(--neon)" strokeWidth="3" strokeLinecap="round" />
      {/* handlebar + headlight */}
      <path d="M136 34 L152 30" stroke="#101f38" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="152" cy="46" r="5.5" fill="var(--neon)" />
      {/* exhaust */}
      <path d="M56 70 L96 66 L110 70 Q112 74 104 76 L64 76 Q54 74 56 70 Z" fill="#c3ccd9" />
      <ellipse cx="110" cy="105" rx="64" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** Royal Enfield–style classic: teardrop tank, round lamp, chrome pipes. */
function ClassicBikeSvg({ body }: { body: string }) {
  const g = gid(body, "re");
  return (
    <svg viewBox="0 0 230 115" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <circle cx="158" cy="48" r="13" fill="var(--neon)" className="rnc-beam" />
      <WireWheel cx={52} cy={82} r={26} />
      <WireWheel cx={176} cy={82} r={26} />
      {/* fenders */}
      <path d="M148 66 A28 28 0 0 1 198 70" fill="none" stroke="#22314f" strokeWidth="6" strokeLinecap="round" />
      <path d="M26 70 A28 28 0 0 1 76 62" fill="none" stroke="#22314f" strokeWidth="6" strokeLinecap="round" />
      {/* fork */}
      <path d="M150 52 L176 78" stroke="#cfd6df" strokeWidth="5.5" strokeLinecap="round" />
      {/* frame + tank */}
      <path d="M96 58 L146 64" stroke="#22314f" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M78 46 Q86 34 106 34 L130 40 Q138 44 134 52 Q114 58 92 55 Q80 53 78 46 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {/* tank pinstripe + badge */}
      <path d="M84 46 Q100 50 124 46" stroke="#e8d9a0" strokeWidth="1.6" fill="none" />
      <circle cx="104" cy="44" r="2.4" fill="#e8d9a0" />
      {/* headlamp shell */}
      <circle cx="158" cy="48" r="9" fill="#101f38" stroke="#cfd6df" strokeWidth="2" />
      <circle cx="158" cy="48" r="4.5" fill="var(--neon)" />
      {/* chrome exhaust */}
      <path d="M82 70 Q116 78 148 70 Q154 74 146 78 Q112 84 86 78 Q76 74 82 70 Z" fill="#d9e0e8" />
      <path d="M40 56 L78 48 Q86 44 96 46 L98 54 L54 62 Q40 60 40 56 Z" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="114" cy="105" rx="64" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** Activa-style scooter: apron, floorboard, chrome mirror, tail. */
function ScooterSvg({ body }: { body: string }) {
  const g = gid(body, "act");
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full drop-shadow-[0_14px_26px_rgba(0,0,0,0.55)]">
      <BodyGradient id={g} body={body} />
      <polygon points="146,42 168,34 158,56" fill="var(--neon)" className="rnc-beam" />
      <AlloyWheel cx={60} cy={92} r={18} />
      <AlloyWheel cx={160} cy={92} r={18} />
      {/* front apron + handle */}
      <path d="M118 30 Q138 30 142 48 L146 66 Q147 76 138 78 L144 82 L144 86 L80 86 Q72 86 74 78 Q70 66 82 64 L116 64 L118 30 Z" fill={`url(#${g})`} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M116 32 L132 34" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
      {/* seat + floorboard */}
      <rect x="66" y="54" width="60" height="12" rx="6" fill="#101f38" />
      <path d="M76 70 L128 70 L132 78 L72 78 Z" fill="rgba(0,0,0,0.3)" />
      {/* mirrors + lamp */}
      <path d="M114 28 L100 24" stroke="#101f38" strokeWidth="4" strokeLinecap="round" />
      <circle cx="97" cy="20" r="3.4" fill="#cfd6df" />
      <circle cx="141" cy="44" r="4.5" fill="var(--neon)" />
      <rect x="70" y="70" width="8" height="5.5" rx="2.4" fill="#ff5470" opacity="0.9" />
      {/* chrome muffler */}
      <path d="M128 74 L156 74 Q162 74 162 79 Q162 84 156 84 L132 84" fill="none" stroke="#c3ccd9" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="110" cy="106" rx="58" ry="6" fill="var(--neon)" className="rnc-beam" />
    </svg>
  );
}

/** Soft motion streaks trailing a vehicle (subtle, opacity-animated). */
function SpeedLines({ delays }: { delays: [string, string, string] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-8 w-24">
      <span className="rnc-speed absolute top-[30%] right-0 h-[2px] w-20 rounded-full bg-gradient-to-l from-neon/70 to-transparent" style={{ animationDelay: delays[0] }} />
      <span className="rnc-speed absolute top-[52%] right-2 h-[2px] w-14 rounded-full bg-gradient-to-l from-white/60 to-transparent" style={{ animationDelay: delays[1] }} />
      <span className="rnc-speed absolute top-[70%] right-0 h-[2px] w-16 rounded-full bg-gradient-to-l from-neon/50 to-transparent" style={{ animationDelay: delays[2] }} />
    </div>
  );
}

/** One cruising lane: position, size, lap duration and phase via props. */
function Lane({
  top,
  size,
  dur,
  delay,
  streaks,
  bobLate = false,
  children,
}: {
  top: string;
  size: string;
  dur: string;
  delay: string;
  streaks: [string, string, string];
  bobLate?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`rnc-cruise absolute ${size}`} style={{ top, animationDuration: dur, animationDelay: delay }}>
      <SpeedLines delays={streaks} />
      <div className={`rnc-bob relative ${bobLate ? "rnc-bob-late" : ""}`}>{children}</div>
    </div>
  );
}

/**
 * Transparent full-hero overlay: the 7-vehicle parade, top → bottom.
 */
export function HeroVehicles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden opacity-45 sm:opacity-55">
      <Lane top="0%" size="w-64 sm:w-80 md:w-[26rem] lg:w-[32rem]" dur="20s" delay="-4s" streaks={["0.3s", "0.8s", "1.4s"]}>
        <SedanSvg body="#cfd8e3" />
      </Lane>

      <Lane top="14%" size="w-52 sm:w-64 md:w-80 lg:w-96" dur="26s" delay="-12s" streaks={["1.0s", "0.2s", "1.7s"]} bobLate>
        <SportbikeSvg body="#ff6b1a" />
      </Lane>

      <Lane top="28%" size="w-72 sm:w-96 md:w-[30rem] lg:w-[38rem]" dur="24s" delay="-8s" streaks={["0.6s", "1.2s", "0.1s"]}>
        <OffroaderSvg body="#3e7d51" />
      </Lane>

      <Lane top="42%" size="w-52 sm:w-64 md:w-80 lg:w-96" dur="30s" delay="-18s" streaks={["0s", "0.5s", "1.1s"]} bobLate>
        <ScooterSvg body="#e23d4e" />
      </Lane>

      <Lane top="56%" size="w-64 sm:w-80 md:w-[26rem] lg:w-[32rem]" dur="22s" delay="-14s" streaks={["1.4s", "0.4s", "0.9s"]}>
        <FastbackSvg body="#8fb6d9" />
      </Lane>

      <Lane top="70%" size="w-52 sm:w-64 md:w-80 lg:w-96" dur="34s" delay="-6s" streaks={["0.2s", "1.6s", "0.7s"]} bobLate>
        <ClassicBikeSvg body="#77804a" />
      </Lane>

      <Lane top="84%" size="w-72 sm:w-96 md:w-[30rem] lg:w-[38rem]" dur="28s" delay="-21s" streaks={["0.9s", "0.1s", "1.3s"]}>
        <SuvSvg body="#f2f6fa" />
      </Lane>
    </div>
  );
}

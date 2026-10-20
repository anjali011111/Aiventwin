import { motion } from 'framer-motion';

/**
 * Interactive anatomy figure. Each organ is a keyboard-focusable button.
 * Colour comes only from the AEVITWIN brand stops (#AEE1FC → #60ABFB → #5170FD → #4636FC).
 * It is a proportioned vector illustration, not a medical-grade or 3D-scanned model.
 * No grid, scan lines or glow: the figure sits directly on the page surface.
 */
const BODY =
  'M108 74 C108 84 106 90 98 94 C80 98 62 104 54 118 C48 130 44 160 40 196 C37 226 33 256 30 282 C28 292 26 300 28 306 C32 312 40 308 42 298 C46 270 52 232 58 204 C62 184 66 164 70 150 C72 180 74 216 78 244 C80 264 74 280 72 300 C70 340 74 372 78 396 C80 430 82 462 84 490 C82 500 76 506 74 512 C84 518 100 518 104 512 C106 500 104 480 104 462 C104 420 108 380 112 340 C114 326 118 316 120 312 C122 316 126 326 128 340 C132 380 136 420 136 462 C136 480 134 500 136 512 C140 518 156 518 166 512 C164 506 158 500 156 490 C158 462 160 430 162 396 C166 372 170 340 168 300 C166 280 160 264 162 244 C166 216 168 180 170 150 C174 164 178 184 182 204 C188 232 194 270 198 298 C200 308 208 312 212 306 C214 300 212 292 210 282 C207 256 203 226 200 196 C196 160 192 130 186 118 C178 104 160 98 142 94 C134 90 132 84 132 74 Z';

const LUNG_L = 'M115 114 C100 110 84 122 82 150 C80 176 88 198 104 198 C113 198 115 188 115 176 Z';
const LUNG_R = 'M125 114 C140 110 156 122 158 150 C160 176 152 198 136 198 C127 198 125 188 125 176 Z';
const HEART = 'M126 140 C118 131 105 137 107 150 C109 163 121 172 127 184 C135 172 149 163 147 150 C145 137 133 131 126 140 Z';
const LIVER = 'M78 208 C92 199 121 201 131 211 C127 228 110 236 92 233 C82 229 78 219 78 208 Z';
const STOMACH = 'M132 205 C148 199 162 208 160 224 C158 238 144 242 136 234 C129 227 134 217 132 205 Z';

export default function BodyTwin({ selected, onSelect, className = '', pulseKey = 0 }) {
  const organ = (id, label, children) => {
    const active = selected === id;
    return (
      <g
        role="button" tabIndex={0} aria-label={`${label}${active ? ' (selected)' : ''}`} aria-pressed={active}
        onClick={() => onSelect?.(id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.(id))}
        className="cursor-pointer outline-none [&:focus-visible_*]:stroke-[#4636FC]"
      >
        {children(active)}
      </g>
    );
  };
  const base = (active) => ({
    fill: active ? 'rgba(81,112,253,.5)' : 'rgba(96,171,251,.28)',
    stroke: active ? '#4636FC' : '#60ABFB',
    strokeWidth: active ? 1.8 : 1,
    strokeLinejoin: 'round',
  });

  return (
    <svg viewBox="0 0 240 520" className={className} role="group" aria-label="Interactive body map. Select an organ to see its Twin metrics.">
      {/* silhouette */}
      <path d={BODY} fill="#AEE1FC" fillOpacity=".45" stroke="#60ABFB" strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="120" cy="44" rx="24" ry="30" fill="#AEE1FC" fillOpacity=".45" stroke="#60ABFB" strokeWidth="1.4" />
      {/* ribcage / midline hints */}
      <path d="M120 100 L120 196" stroke="#60ABFB" strokeOpacity=".35" strokeWidth="1" fill="none" />

      {organ('brain', 'Brain', (a) => (
        <>
          <ellipse cx="120" cy="38" rx="17" ry="14" {...base(a)} />
          <path d="M120 25 C116 32 124 36 120 42 C116 46 122 50 120 52" fill="none" stroke={base(a).stroke} strokeOpacity=".6" strokeWidth=".9" />
        </>
      ))}
      {organ('lungs', 'Lungs', (a) => (<><path d={LUNG_L} {...base(a)} /><path d={LUNG_R} {...base(a)} /></>))}
      {organ('heart', 'Heart', (a) => (
        <motion.path key={pulseKey} d={HEART} {...base(a)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scale: [1, 1.12, 1, 1.07, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }} />
      ))}
      {organ('liver', 'Liver', (a) => <path d={LIVER} {...base(a)} />)}
      {organ('stomach', 'Stomach', (a) => <path d={STOMACH} {...base(a)} />)}
      {organ('kidneys', 'Kidneys', (a) => (
        <>
          <ellipse cx="94" cy="256" rx="6" ry="12" transform="rotate(12 94 256)" {...base(a)} />
          <ellipse cx="146" cy="256" rx="6" ry="12" transform="rotate(-12 146 256)" {...base(a)} />
        </>
      ))}
    </svg>
  );
}

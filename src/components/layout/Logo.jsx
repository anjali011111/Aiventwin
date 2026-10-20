import { Link } from 'react-router-dom';

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="aevMark" gradientUnits="userSpaceOnUse" x1="-2.93" y1="5.07" x2="34.93" y2="26.93">
          <stop offset="0" stopColor="#AEE1FC" /><stop offset=".35" stopColor="#60ABFB" /><stop offset=".68" stopColor="#5170FD" /><stop offset="1" stopColor="#4636FC" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#aevMark)" />
      <path d="M5 17h5l3-7 4 13 3-6h7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ to = '/', light = false, tagline = false }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="AEVITWIN home">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block text-[17px] font-bold tracking-wide ${light ? 'text-white' : 'text-navy'}`}>AEVITWIN</span>
        {tagline && <span className={`block text-[10px] ${light ? 'text-slate-400' : 'text-subtle'}`}>A Lifetime of Health, Connected.</span>}
      </span>
    </Link>
  );
}

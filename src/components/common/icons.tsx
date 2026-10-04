/** Stroke icon set, sized in the same idiom as the nav glyphs (see `.icon svg` in styles.css). */
export function X({ s = 14 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Rows({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Grid({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function User({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.4-3.6 3.8-5.2 7-5.2s5.6 1.6 7 5.2" />
    </svg>
  );
}

export function Globe({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5z" />
    </svg>
  );
}

export function Palette({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.3 0 2-.9 2-1.9 0-1.5-1.3-1.8-1.3-3 0-.9.8-1.6 1.8-1.6h1.9A4.6 4.6 0 0 0 21 8.4C21 5.6 17 3.5 12 3.5z" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="10" r="1" />
    </svg>
  );
}

export function Drive({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="3" y="5" width="18" height="6" rx="2" />
      <rect x="3" y="13" width="18" height="6" rx="2" />
      <path d="M6.8 8h.01M6.8 16h.01" />
    </svg>
  );
}

export function Cpu({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10.5 3.5v3.5M13.5 3.5v3.5M10.5 17v3.5M13.5 17v3.5M3.5 10.5H7M3.5 13.5H7M17 10.5h3.5M17 13.5h3.5" />
    </svg>
  );
}

export function LifeBuoy({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M6 6l3.5 3.5M18 18l-3.5-3.5M18 6l-3.5 3.5M6 18l3.5-3.5" />
    </svg>
  );
}

export function Info({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </svg>
  );
}

export function Refresh({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.4 4v4.4H16" />
    </svg>
  );
}

export function Copy({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" />
    </svg>
  );
}

export function Mail({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7.5l7.1 5a1.6 1.6 0 0 0 1.8 0l7.1-5" />
    </svg>
  );
}

export function Search({ s = 15 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L20.5 20.5" />
    </svg>
  );
}

export function Chev({ s = 14 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function Check({ s = 14 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function Tag({ s = 16 }: { s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M11.6 3.5H20v8.4l-8.9 8.9a2 2 0 0 1-2.8 0l-5.6-5.6a2 2 0 0 1 0-2.8z" />
      <circle cx="16.2" cy="7.8" r="1.4" />
    </svg>
  );
}
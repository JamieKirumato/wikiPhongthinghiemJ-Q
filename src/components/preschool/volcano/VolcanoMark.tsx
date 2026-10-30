/** Subject emblem: real lava. The tabletop experiment itself contains cool colored water. */
export function VolcanoMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path d="M3 55 18 35 24 23 40 23 47 37 62 55Z" fill="#173F46"/>
    <path d="m24 26 3 12-9 17H3l15-20Z" fill="#285962"/>
    <path d="m38 27 9 10 15 18H38l-4-16Z" fill="#10353E"/>
    <ellipse cx="32" cy="25" rx="8" ry="4" fill="#251F1C"/>
    <path d="M29 25c-4 6 2 10-3 15s-1 8-6 12h12c-3-7 4-8 1-15s7-9 3-12Z" fill="#E4442C"/>
    <path d="M30 26c-2 6 3 8 0 13s-1 7-3 10" stroke="#FFAC39" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="m29 19-3-7m10 6 4-8m-7 6V8" stroke="#DC3B27" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="23" cy="9" r="2" fill="#EF6933"/>
  </svg>;
}

/** Subject emblem: real lava. The tabletop experiment itself contains cool colored water. */
export function VolcanoMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="62" height="62" rx="19" fill="#F6C64B"/>
    <path d="M8 52 20 35 24 24 40 24 45 37 57 52Z" fill="#493B34"/>
    <path d="m24 26 3 12-9 14H8l12-17Z" fill="#6F5647"/>
    <path d="m38 27 7 10 12 15H38l-4-13Z" fill="#302A26"/>
    <ellipse cx="32" cy="25" rx="8" ry="4" fill="#251F1C"/>
    <path d="M29 25c-4 6 2 10-3 15s-1 8-6 12h12c-3-7 4-8 1-15s7-9 3-12Z" fill="#E4442C"/>
    <path d="M30 26c-2 6 3 8 0 13s-1 7-3 10" stroke="#FFAC39" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="m29 19-3-7m10 6 4-8m-7 6V8" stroke="#DC3B27" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="23" cy="9" r="2" fill="#EF6933"/>
  </svg>;
}

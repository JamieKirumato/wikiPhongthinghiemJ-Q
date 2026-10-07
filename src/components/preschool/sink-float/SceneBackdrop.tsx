export type SceneSetting = 'laboratory' | 'seaside';

/** Quiet illustrative surroundings, leaving the central experiment unobstructed. */
export function SceneBackdrop({ setting }: { setting: SceneSetting }) {
  return <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="lab-wall" x2="0" y2="1"><stop stopColor="#f9f8f1"/><stop offset=".6" stopColor="#edf2ec"/><stop offset="1" stopColor="#dce9e4"/></linearGradient>
      <linearGradient id="lab-window" x2="1" y2="1"><stop stopColor="#fffefa" stopOpacity=".95"/><stop offset="1" stopColor="#dceee6" stopOpacity=".25"/></linearGradient>
      <radialGradient id="lab-daylight"><stop stopColor="#fffef7" stopOpacity=".9"/><stop offset="1" stopColor="#fffef7" stopOpacity="0"/></radialGradient>
      <linearGradient id="sea-sky" x2="0" y2="1"><stop stopColor="#bfeafa"/><stop offset="1" stopColor="#eefaff"/></linearGradient>
      <linearGradient id="sea-water" x2="0" y2="1"><stop stopColor="#6bc9dc"/><stop offset="1" stopColor="#b5e9ef"/></linearGradient>
    </defs>
    {setting === 'laboratory' ? <>
      <rect width="1000" height="800" fill="url(#lab-wall)"/>
      <ellipse cx="320" cy="120" rx="580" ry="380" fill="url(#lab-daylight)"/>
      <g opacity=".65">
        <rect x="82" y="-40" width="386" height="268" rx="8" fill="url(#lab-window)" stroke="#fffdf7" strokeWidth="5"/>
        <path d="M210 -40V228M340 -40V228" stroke="#fffdf7" strokeWidth="6"/>
        <path d="M90 238H472" stroke="#bccfc5" strokeWidth="2"/>
      </g>
      <g opacity=".5">
        <path d="M784 169H940" stroke="#b9c7ba" strokeWidth="3"/>
        <rect x="810" y="138" width="32" height="29" rx="3" fill="#d4c5ac"/>
        <path d="M826 141V101M826 122Q796 121 803 103Q823 102 826 122M826 113Q849 111 850 92Q829 93 826 113" fill="#7c9d84" stroke="#7c9d84" strokeWidth="2"/>
        <path d="M890 120V135L882 152Q878 166 893 166H910Q925 166 920 152L912 135V120Z" fill="#d9e9de" stroke="#a5bfb0" strokeWidth="2"/>
      </g>
    </> : <>
      <rect width="1000" height="800" fill="url(#sea-sky)"/>
      <circle cx="860" cy="87" r="40" fill="#fff0ac"/>
      <path d="M50 94Q65 60 100 78Q124 41 151 81Q185 67 195 96Z M570 125Q588 95 613 113Q640 86 661 117Q688 106 700 127Z" fill="white" opacity=".85"/>
      <rect y="190" width="1000" height="610" fill="url(#sea-water)"/>
      <path d="M0 221Q100 205 200 221T400 221T600 221T800 221T1000 221M0 255Q120 239 240 255T480 255T720 255T960 255" fill="none" stroke="#e6fafb" strokeWidth="5" opacity=".65"/>
      <path d="M0 470Q300 410 580 480T1000 455V800H0Z" fill="#f6ecd4"/>
    </>}
  </svg>;
}

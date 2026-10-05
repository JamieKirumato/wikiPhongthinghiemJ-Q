export type SceneSetting = 'laboratory' | 'seaside';

/** Quiet illustrative surroundings, leaving the central experiment unobstructed. */
export function SceneBackdrop({ setting }: { setting: SceneSetting }) {
  return <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="lab-wall" x2="0" y2="1"><stop stopColor="#eaf6fb"/><stop offset="1" stopColor="#cce4ee"/></linearGradient>
      <linearGradient id="sea-sky" x2="0" y2="1"><stop stopColor="#bfeafa"/><stop offset="1" stopColor="#eefaff"/></linearGradient>
      <linearGradient id="sea-water" x2="0" y2="1"><stop stopColor="#6bc9dc"/><stop offset="1" stopColor="#b5e9ef"/></linearGradient>
    </defs>
    {setting === 'laboratory' ? <>
      <rect width="1000" height="800" fill="url(#lab-wall)"/>
      <rect x="40" y="36" width="260" height="165" rx="16" fill="#fff" stroke="#b1d3df" strokeWidth="9"/>
      <rect x="55" y="51" width="230" height="135" rx="8" fill="#cfedf7"/>
      <path d="M170 51V186M55 119H285" stroke="white" strokeWidth="9"/>
      <path d="M66 165Q130 120 185 153T282 135V186H55Z" fill="#b7dfcf"/>
      <rect x="690" y="105" width="250" height="14" rx="7" fill="#91b1c0"/>
      <rect x="705" y="172" width="235" height="14" rx="7" fill="#91b1c0"/>
      {[735, 815, 900].map((x,i)=><g key={x}><path d={`M${x-10} 53H${x+10}V72L${x+25} 95Q${x+28} 107 ${x+12} 107H${x-12}Q${x-28} 107 ${x-25} 95L${x-10} 72Z`} fill={['#9bdacf','#f5d28e','#c6b6e9'][i]} stroke="#fff" strokeWidth="4"/><rect x={x-15} y="132" width="30" height="36" rx="6" fill={['#c2dcec','#bdddc7','#f1c8b8'][i]}/></g>)}
      <path d="M0 235H1000" stroke="#a8c7d4" strokeWidth="8"/>
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

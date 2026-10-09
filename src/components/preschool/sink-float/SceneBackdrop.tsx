export type SceneSetting = 'laboratory' | 'seaside' | 'classroom' | 'home-yard' | 'school-garden' | 'picnic' | 'nature-corner' | 'discovery-island';
export const SCENE_OPTIONS: {id:SceneSetting;label:string;icon:string}[] = [
  {id:'laboratory',label:'Phòng thí nghiệm',icon:'🔬'},
  {id:'seaside',label:'Bờ biển',icon:'🌊'},
  {id:'classroom',label:'Lớp học mầm non',icon:'🏫'},
  {id:'home-yard',label:'Sân nhà',icon:'🏡'},
  {id:'school-garden',label:'Vườn trường',icon:'🌱'},
  {id:'picnic',label:'Khu dã ngoại',icon:'🧺'},
  {id:'nature-corner',label:'Góc thiên nhiên trong nhà',icon:'🪴'},
  {id:'discovery-island',label:'Đảo khám phá',icon:'🏝️'},
];

function Tree({x,y,scale=1}:{x:number;y:number;scale?:number}){
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 12V140" stroke="#a59576" strokeWidth="15"/><ellipse cy="-20" rx="65" ry="72" fill="#a8c6a2"/><circle cx="-42" cy="8" r="46" fill="#b8cfa8"/><circle cx="39" cy="-4" r="50" fill="#9ebb9a"/></g>;
}
function Plant({x,y}:{x:number;y:number}){
  return <g transform={`translate(${x} ${y})`}><path d="M-23 0H23L17 38H-17Z" fill="#d7bca0"/><path d="M0 0V-58M0-24Q-38-55-31-67Q-6-68 0-24M0-38Q28-79 40-62Q35-38 0-38" fill="#9eb89b" stroke="#8ea88c" strokeWidth="3"/></g>;
}

function NewSurroundings({setting}:{setting:SceneSetting}){
  const indoor=setting==='classroom'||setting==='nature-corner';
  const island=setting==='discovery-island';
  return <>
    <rect width="1000" height="800" fill={indoor?'#f8f4ea':island?'#dff3f5':'#eef6eb'}/>
    <path d="M0 190Q290 160 550 185T1000 170V800H0Z" fill={indoor?'#ede8dc':island?'#cfebed':'#dfeadc'}/>
    {!indoor&&<><circle cx="835" cy="70" r="32" fill="#fff0c0"/><path d="M280 70Q295 41 322 58Q351 34 369 67Q391 58 405 78H280Z" fill="#fffefa" opacity=".75"/></>}
    <g transform="translate(150 0) scale(.7 1)">
    {setting==='classroom'&&<g opacity=".7">
      <rect x="65" y="40" width="240" height="138" rx="12" fill="#e4eee4" stroke="#d1ba92" strokeWidth="9"/>
      <path d="M96 138L126 97L154 138Z" fill="#b9cdba"/><circle cx="206" cy="107" r="25" fill="#edcba9"/><path d="M252 84V130H277V84Z" fill="#bdced5"/>
      <rect x="762" y="65" width="180" height="135" rx="10" fill="#dfcfb5"/>
      <path d="M770 130H934" stroke="#f7f0e3" strokeWidth="8"/>
      <rect x="780" y="87" width="27" height="34" rx="4" fill="#b8cbbb"/><rect x="818" y="98" width="30" height="23" rx="4" fill="#e5bb9c"/><circle cx="882" cy="108" r="14" fill="#bacbd5"/>
      <Plant x={885} y={167}/>
    </g>}
    {setting==='home-yard'&&<g opacity=".65">
      <path d="M20 172V119L116 53L215 119V172" fill="#e6d7c2"/><path d="M6 121L116 42L229 121" fill="none" stroke="#c9ac97" strokeWidth="10"/>
      <rect x="72" y="110" width="44" height="62" rx="3" fill="#d3c2a8"/><rect x="142" y="108" width="38" height="32" fill="#edf4ec"/>
      <Tree x={900} y={65} scale={.8}/>
      <path d="M715 173H990M715 199H990M735 158V222M785 158V222M835 158V222M885 158V222M935 158V222" stroke="#c5c5ad" strokeWidth="7"/>
      <Plant x={70} y={236}/>
    </g>}
    {setting==='school-garden'&&<g opacity=".7">
      <Tree x={80} y={68} scale={.7}/><Tree x={915} y={73} scale={.85}/>
      <rect x="240" y="82" width="230" height="80" rx="6" fill="#e7dbbd"/><path d="M225 82L355 24L487 82" fill="#cfbdac"/>
      <path d="M260 108H450M285 93V148M328 93V148M371 93V148M414 93V148" stroke="#f8f6e9" strokeWidth="8"/>
      <path d="M22 244H210L193 270H38Z M776 236H977L958 261H793Z" fill="#cbb99d"/>
      {[48,94,146,190,810,860,915,955].map((x,i)=><g key={x}><path d={`M${x} 247V216`} stroke="#a2b99a" strokeWidth="4"/><circle cx={x} cy="214" r="10" fill={i%2?'#e4cda9':'#d9b9b3'}/></g>)}
    </g>}
    {setting==='picnic'&&<g opacity=".7">
      <Tree x={80} y={60} scale={.9}/><Tree x={916} y={65} scale={.85}/>
      <path d="M735 156H960M770 156L747 230M921 156L943 230M725 194H971" stroke="#b5a286" strokeWidth="12" strokeLinecap="round"/>
      <rect x="842" y="125" width="60" height="28" rx="6" fill="#cfb995"/><path d="M853 125Q872 93 892 125" fill="none" stroke="#b3a184" strokeWidth="5"/>
      <path d="M25 238L156 233L197 273L43 279Z" fill="#d6bcb3"/><path d="M48 249L177 251M71 236L95 276M118 236L143 274" stroke="#f2e8da" strokeWidth="6"/>
    </g>}
    {setting==='nature-corner'&&<g opacity=".75">
      <rect x="52" y="24" width="270" height="148" rx="8" fill="#edf3e6" stroke="#e1d6bc" strokeWidth="8"/><path d="M186 24V172M52 98H322" stroke="#fdf9ef" strokeWidth="8"/>
      <path d="M735 120H970M735 205H970" stroke="#c4b398" strokeWidth="8"/>
      <Plant x={783} y={82}/><Plant x={911} y={82}/><Plant x={60} y={260}/>
      <rect x="780" y="176" width="65" height="26" rx="7" fill="#dac8a9"/><path d="M885 192Q873 154 898 152Q910 177 885 192" fill="#b3c3a2"/>
    </g>}
    {island&&<g opacity=".8">
      <path d="M0 230Q180 172 330 220T680 222T1000 215V800H0Z" fill="#f3e9d0"/>
      <path d="M64 244Q94 177 97 105M928 244Q903 172 910 104" fill="none" stroke="#c3b397" strokeWidth="13"/>
      <path d="M97 107Q39 50 4 99Q48 87 97 107Q78 30 138 33Q108 63 97 107Q149 52 184 90Q139 83 97 107M910 106Q855 47 818 88Q863 82 910 106Q899 34 954 30Q922 70 910 106Q968 61 1000 104Q956 89 910 106" fill="#a9c5ad"/>
      <rect x="778" y="226" width="80" height="43" rx="8" fill="#d4bea0" stroke="#bba887" strokeWidth="3"/><path d="M818 226V269" stroke="#ebdbb7" strokeWidth="8"/><rect x="812" y="241" width="12" height="12" rx="2" fill="#ab9678"/>
    </g>}
    </g>
  </>;
}

/** Quiet illustrative surroundings, leaving the central experiment unobstructed. */
export function SceneBackdrop({ setting }: { setting: SceneSetting }) {
  return <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="lab-wall" x2="0" y2="1"><stop stopColor="#f9f8f1"/><stop offset=".6" stopColor="#edf2ec"/><stop offset="1" stopColor="#dce9e4"/></linearGradient>
      <radialGradient id="lab-daylight"><stop stopColor="#fffef7" stopOpacity=".9"/><stop offset="1" stopColor="#fffef7" stopOpacity="0"/></radialGradient>
      <linearGradient id="sea-sky" x2="0" y2="1"><stop stopColor="#bfeafa"/><stop offset="1" stopColor="#eefaff"/></linearGradient>
      <linearGradient id="sea-water" x2="0" y2="1"><stop stopColor="#6bc9dc"/><stop offset="1" stopColor="#b5e9ef"/></linearGradient>
    </defs>
    {setting === 'laboratory' ? <>
      <rect width="1000" height="800" fill="url(#lab-wall)"/>
      <ellipse cx="320" cy="120" rx="580" ry="380" fill="url(#lab-daylight)"/>
      <g opacity=".5">
        <path d="M784 169H940" stroke="#b9c7ba" strokeWidth="3"/>
        <rect x="810" y="138" width="32" height="29" rx="3" fill="#d4c5ac"/>
        <path d="M826 141V101M826 122Q796 121 803 103Q823 102 826 122M826 113Q849 111 850 92Q829 93 826 113" fill="#7c9d84" stroke="#7c9d84" strokeWidth="2"/>
        <path d="M890 120V135L882 152Q878 166 893 166H910Q925 166 920 152L912 135V120Z" fill="#d9e9de" stroke="#a5bfb0" strokeWidth="2"/>
      </g>
    </> : setting==='seaside' ? <>
      <rect width="1000" height="800" fill="url(#sea-sky)"/>
      <circle cx="860" cy="87" r="40" fill="#fff0ac"/>
      <path d="M50 94Q65 60 100 78Q124 41 151 81Q185 67 195 96Z M570 125Q588 95 613 113Q640 86 661 117Q688 106 700 127Z" fill="white" opacity=".85"/>
      <rect y="190" width="1000" height="610" fill="url(#sea-water)"/>
      <path d="M0 221Q100 205 200 221T400 221T600 221T800 221T1000 221M0 255Q120 239 240 255T480 255T720 255T960 255" fill="none" stroke="#e6fafb" strokeWidth="5" opacity=".65"/>
      <path d="M0 470Q300 410 580 480T1000 455V800H0Z" fill="#f6ecd4"/>
    </> : <NewSurroundings setting={setting}/>}
  </svg>;
}

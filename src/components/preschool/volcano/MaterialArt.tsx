import { Ingredient } from './reaction';

export const MATERIALS: {id:Ingredient; name:string; note:string; tint:string}[] = [
  {id:'bakingSoda',name:'Baking soda',note:'Một thìa nhỏ',tint:'#e3b559'},
  {id:'vinegar',name:'Giấm ăn',note:'Một cốc nhỏ',tint:'#68a6aa'},
  {id:'water',name:'Nước',note:'Một cốc nhỏ',tint:'#78b9e3'},
  {id:'soap',name:'Nước rửa chén',note:'Tùy chọn · một giọt',tint:'#d6a545'},
  {id:'color',name:'Màu thực phẩm',note:'Tùy chọn · một giọt',tint:'#df7b68'},
];

/** Code-native illustrations keep tools legible while carried or poured. */
export function MaterialArt({kind}:{kind:Ingredient}) {
  const tint = MATERIALS.find(m=>m.id===kind)!.tint;
  return <svg viewBox="0 0 120 110" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="98" rx="38" ry="6" fill="#254658" opacity=".09"/>
    {kind==='bakingSoda' ? <>
      <path d="M22 29 Q42 21 64 29 L65 87 Q43 98 22 86Z" fill="#f4e4bc" stroke="#c7aa72" strokeWidth="2"/>
      <ellipse cx="43" cy="29" rx="21" ry="7" fill="#fffdf5" stroke="#c7aa72" strokeWidth="2"/>
      <path d="M29 51H57V77H29Z" fill="#fffdf5" rx="3"/><path d="M33 61H53M37 67H49" stroke="#b39869" strokeWidth="3" strokeLinecap="round"/>
      <path d="M99 21L79 70" stroke="#9b7955" strokeWidth="7" strokeLinecap="round"/><ellipse cx="76" cy="77" rx="11" ry="17" transform="rotate(23 76 77)" fill="#d6c5a6" stroke="#9b7955" strokeWidth="2"/>
      <ellipse cx="76" cy="75" rx="9" ry="11" fill="#fffef5" transform="rotate(23 76 75)"/>
    </> : kind==='water'||kind==='vinegar' ? <>
      <path d="M82 39C114 35 113 78 82 75" stroke="#a1bec4" strokeWidth="6"/>
      <path d="M27 23H84L80 88Q57 99 32 88Z" fill="#f3fcfd" fillOpacity=".75" stroke="#a1bec4" strokeWidth="2.5"/>
      <path d="M31 51Q57 60 82 51L79 86Q56 96 34 86Z" fill={tint} opacity=".42"/>
      <ellipse cx="56" cy="51" rx="25" ry="6" fill={tint} opacity=".5"/>
      <path d="M38 34L40 80" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".9"/>
      {kind==='vinegar'&&<><rect x="42" y="60" width="28" height="18" rx="5" fill="#fffdf5"/><path d="M49 69H63" stroke="#619296" strokeWidth="3" strokeLinecap="round"/></>}
    </> : <>
      <path d="M46 33H74L80 87Q60 99 39 87Z" fill={tint} fillOpacity=".65" stroke={tint} strokeWidth="2.5"/>
      <path d="M50 16H70V34H50Z" fill={kind==='soap'?'#e9d4a1':'#d35550'}/>
      <path d="M54 6H66L69 17H51Z" fill="#527a7e"/>
      <rect x="46" y="52" width="27" height="26" rx="6" fill="#fffcf4"/>
      <path d="M60 57Q47 70 60 73Q73 70 60 57Z" fill={tint}/>
      <path d="M46 44L44 81" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".7"/>
    </>}
  </svg>;
}

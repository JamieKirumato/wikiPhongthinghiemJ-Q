import { useId } from 'react';
export type PlayArtKind = 'spoon' | 'bowl' | 'vinegar' | 'color' | 'cup' | 'add' | 'smooth' | 'channel' | 'remove' | 'clay';
/** Local vector tool illustrations: the same objects as those on the table. */
export function PlayArt({kind}:{kind:PlayArtKind}) {
  const id=useId().replace(/:/g,'');
  return <svg viewBox="0 0 100 90" fill="none" aria-hidden="true"><defs>
    <linearGradient id={`${id}clay`} x1="20" y1="20" x2="77" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#CD9569"/><stop offset=".55" stopColor="#A96743"/><stop offset="1" stopColor="#75472F"/></linearGradient>
    <linearGradient id={`${id}steel`} x1="20" y1="20" x2="65" y2="70"><stop stopColor="#F8FCFC"/><stop offset=".5" stopColor="#A4B1B5"/><stop offset="1" stopColor="#DFE6E8"/></linearGradient>
  </defs><ellipse cx="50" cy="80" rx="34" ry="5" fill="#66442F" opacity=".12"/>
  {kind==='spoon'?<><path d="M72 10Q79 7 79 15L48 60L40 54Z" fill={`url(#${id}steel)`} stroke="#687B82" strokeWidth="1.5"/><ellipse cx="36" cy="64" rx="22" ry="14" transform="rotate(-29 36 64)" fill={`url(#${id}steel)`} stroke="#7A8C92" strokeWidth="1.5"/><path d="M18 65Q31 43 51 58Q45 72 18 65" fill="#FFFDF5"/></>:
  kind==='bowl'?<><path d="M12 42Q16 79 50 80Q84 78 88 42" fill="#E0C79C" stroke="#A88A5D" strokeWidth="2"/><ellipse cx="50" cy="42" rx="38" ry="15" fill="#F3E4C9"/><path d="M17 43Q50 9 83 43Q50 59 17 43" fill="#FFFDF5"/></>:
  kind==='vinegar'?<><path d="M72 27C99 26 99 63 74 65" stroke="#8FAAAE" strokeWidth="5"/><path d="M22 18H76L72 74Q49 86 27 74Z" fill="#EEF7F6" fillOpacity=".8" stroke="#91ABAD" strokeWidth="2"/><path d="M26 43Q49 50 74 43L70 72Q48 81 29 72Z" fill="#B8D5CE" fillOpacity=".66"/><path d="M32 26L34 66" stroke="white" strokeWidth="4" strokeLinecap="round"/><rect x="37" y="49" width="26" height="21" rx="5" fill="#FFF7E8"/><path d="M45 60H56" stroke="#9B7148" strokeWidth="3" strokeLinecap="round"/></>:
  kind==='color'?<><path d="M37 39H67L73 73Q53 84 32 73Z" fill="#D8422F" fillOpacity=".8" stroke="#A52C21" strokeWidth="2"/><rect x="39" y="25" width="26" height="15" rx="4" fill="#59423A"/><path d="M43 25V16Q52 4 61 16V25" fill="#D8422F"/><rect x="40" y="48" width="25" height="22" rx="6" fill="#FFF7E8"/><path d="M53 52Q41 65 53 67Q65 65 53 52" fill="#DF432E"/><path d="M80 15Q70 29 80 31Q90 29 80 15" fill="#E04932"/></>:
  kind==='cup'?<><path d="M23 25H77L72 73Q50 83 28 73Z" fill="#EAF2F0" fillOpacity=".8" stroke="#96A9A8" strokeWidth="2"/><ellipse cx="50" cy="25" rx="27" ry="8" fill="#C4D6D3" stroke="#8A9D9C" strokeWidth="2"/><ellipse cx="50" cy="25" rx="22" ry="5" fill="#5F6964"/><path d="M34 36L37 67" stroke="white" strokeWidth="4" strokeLinecap="round"/></>:
  <><path d="M17 67C8 50 30 43 28 29C30 13 62 16 65 30C71 39 94 45 83 67C70 82 32 82 17 67Z" fill={`url(#${id}clay)`}/><path d="M29 46Q40 37 48 42M37 58Q52 50 64 57" stroke="#E3B28B" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
  {kind==='add'&&<><path d="M72 16V36M62 26H82" stroke="#FFF7E8" strokeWidth="6" strokeLinecap="round"/><path d="M12 34Q4 23 16 17Q30 17 29 30Z" fill="#CD9569"/></>}
  {kind==='remove'&&<><path d="M61 25H83" stroke="#FFF7E8" strokeWidth="6" strokeLinecap="round"/><path d="M68 47L84 37" stroke="#F6C64B" strokeWidth="4" strokeLinecap="round"/></>}
  {kind==='channel'&&<><path d="M48 26Q61 38 47 49T39 73" stroke="#69402D" strokeWidth="9" strokeLinecap="round"/><path d="M50 27Q62 38 49 50T42 73" stroke="#D6A078" strokeWidth="2" strokeLinecap="round"/><path d="M65 11L51 35" stroke="#EBCF99" strokeWidth="8" strokeLinecap="round"/></>}
  {kind==='smooth'&&<><path d="M36 23L57 13Q63 11 65 18L72 40Q75 49 65 53L54 57Q48 59 44 51L34 32Q31 26 36 23Z" fill="#F1C29F" stroke="#CE9876" strokeWidth="1.5"/><path d="M18 58Q27 50 32 51M18 65Q26 59 32 59" stroke="#F6C64B" strokeWidth="3" strokeLinecap="round"/></>}
  </>}
  </svg>;
}

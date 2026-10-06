export function WaterStream({from,to}:{from:{x:number;y:number};to:{x:number;y:number}}){
  return <svg aria-hidden="true" data-water-stream className="fixed inset-0 w-screen h-screen pointer-events-none z-50 overflow-visible">
    <path d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`} fill="none" stroke="#66d4ec" strokeWidth="7" strokeLinecap="round" opacity=".8"/>
    <path d={`M ${from.x+1} ${from.y} L ${to.x+1} ${to.y}`} fill="none" stroke="#e4ffff" strokeWidth="2" opacity=".85"/>
    <ellipse cx={to.x} cy={to.y} rx="15" ry="5" fill="none" stroke="#74d6ed" strokeWidth="3"/>
  </svg>;
}

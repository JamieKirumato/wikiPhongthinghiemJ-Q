import {useEffect, useRef, useState} from 'react';

export type SceneSetting = 'laboratory' | 'seaside' | 'classroom' | 'home-yard' | 'school-garden' | 'picnic' | 'nature-corner' | 'discovery-island';

export const SCENE_OPTIONS: {id:SceneSetting;label:string;icon:string;image:string;thumbnail:string}[] = [
  {id:'laboratory',label:'Phòng thí nghiệm',icon:'🔬'},
  {id:'seaside',label:'Bờ biển',icon:'🌊'},
  {id:'classroom',label:'Lớp học mầm non',icon:'🏫'},
  {id:'home-yard',label:'Sân nhà',icon:'🏡'},
  {id:'school-garden',label:'Vườn trường',icon:'🌱'},
  {id:'picnic',label:'Khu dã ngoại',icon:'🧺'},
  {id:'nature-corner',label:'Góc thiên nhiên trong nhà',icon:'🪴'},
  {id:'discovery-island',label:'Đảo khám phá',icon:'🏝️'},
].map(option=>({...option,id:option.id as SceneSetting,image:`/assets/sink-float/scenes/${option.id}.webp`,thumbnail:`/assets/sink-float/scenes/${option.id}-thumb.webp`}));

/** Background plates contain no tank or objects: all experiment geometry stays live. */
export function SceneBackdrop({ setting, imageRef, extendTable = false }: { setting: SceneSetting; imageRef?: React.Ref<HTMLImageElement>; extendTable?: boolean }) {
  const scene = SCENE_OPTIONS.find(option=>option.id===setting) || SCENE_OPTIONS[0];
  const tableRef = useRef<HTMLImageElement>(null);
  const [tableStart, setTableStart] = useState('58%');
  const alignTable = () => {
    const image = tableRef.current;
    if (!image?.naturalWidth || !image.clientHeight) return;
    const scale = Math.max(image.clientWidth / image.naturalWidth, image.clientHeight / image.naturalHeight);
    const renderedHeight = image.naturalHeight * scale;
    setTableStart(`${Math.max(0, Math.min(100, ((image.clientHeight - renderedHeight) / 2 + renderedHeight * .58) / image.clientHeight * 100))}%`);
  };
  useEffect(() => {
    if (!extendTable || !tableRef.current) return;
    const observer = new ResizeObserver(alignTable);
    observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, [extendTable, setting]);
  return <><img key={scene.id} ref={imageRef} aria-hidden="true" alt="" src={scene.image}
    data-scene={scene.id} className="lab-studio-backdrop" draggable={false}
    onError={event=>{const img=event.currentTarget;if(!img.src.endsWith('/classroom-studio.png'))img.src='/assets/sink-float/classroom-studio.png';}}/>
    {extendTable && <img ref={tableRef} aria-hidden="true" alt="" src={scene.image} draggable={false}
      className="lab-studio-tabletop" style={{clipPath:`inset(${tableStart} 0 0)`,transformOrigin:`50% ${tableStart}`}}
      onLoad={alignTable} onError={event=>{const img=event.currentTarget;if(!img.src.endsWith('/classroom-studio.png'))img.src='/assets/sink-float/classroom-studio.png';}}/>}
  </>;
}

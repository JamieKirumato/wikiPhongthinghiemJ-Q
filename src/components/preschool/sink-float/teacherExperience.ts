import transcripts from '../../../../public/audio/vi/transcripts.json';
import {INTRO_GUIDE,IntroAction} from './introGuide';
export const INTRO_ACTIONS=INTRO_GUIDE.filter(s=>s.action!=='welcome'&&s.action!=='ready').map(s=>s.action);
export type ExperienceSettings={introEnabled:boolean;effectsVolume:number;introActions:IntroAction[]};
export const SETTINGS_KEY='sink-float-teacher-experience-v1';
export const DEFAULT_EXPERIENCE:ExperienceSettings={introEnabled:true,effectsVolume:100,introActions:[...INTRO_ACTIONS]};
export function normalizeExperience(value:unknown):ExperienceSettings{
  const raw=value as Partial<ExperienceSettings>|null;
  return {introEnabled:typeof raw?.introEnabled==='boolean'?raw.introEnabled:true,effectsVolume:typeof raw?.effectsVolume==='number'&&Number.isFinite(raw.effectsVolume)?Math.max(0,Math.min(100,raw.effectsVolume)):100,introActions:Array.isArray(raw?.introActions)?INTRO_ACTIONS.filter(a=>raw.introActions!.includes(a)):[...INTRO_ACTIONS]};
}
export function selectedIntroGuide(settings:ExperienceSettings){return settings.introActions.length?INTRO_GUIDE.filter(s=>s.action==='welcome'||s.action==='ready'||settings.introActions.includes(s.action)):[];}
export function readExperience():ExperienceSettings{try{return normalizeExperience(JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null'));}catch{return {...DEFAULT_EXPERIENCE};}}
export function saveExperience(settings:ExperienceSettings){localStorage.setItem(SETTINGS_KEY,JSON.stringify(normalizeExperience(settings)));}
export const defaultIntroText=(key:string)=>(transcripts as Record<string,string>)[key]||'';
export const INTRO_LABELS=['Chào và bắt đầu','Cầm, thả và ném đồ vật','Thả ra ngoài bể','Cầm lại và dìm vật','Xoay bể và zoom','Xúc và đổ muối','Khuấy nước','Rót thêm nước','Múc và trả nước','Đến lượt trẻ khám phá'];
export type NarrationRecord=Record<string,{text:string;audio:Blob}>;
function openStore():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(new Error('Trình duyệt chưa hỗ trợ lưu bản đọc.'));return;}
  const request=indexedDB.open('sink-float-teacher-narration',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('scripts');
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}
export async function readNarration():Promise<NarrationRecord>{
  const db=await openStore();try{return await new Promise((resolve,reject)=>{
    const tx=db.transaction('scripts','readonly'),req=tx.objectStore('scripts').get('guide');
    req.onsuccess=()=>resolve(req.result||{});req.onerror=()=>reject(req.error);
  });}finally{db.close();}
}
export async function writeNarration(record:NarrationRecord){
  const db=await openStore();try{await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('scripts','readwrite');tx.objectStore('scripts').put(record,'guide');
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });}finally{db.close();}
}
export async function createNarration(text:string,signal?:AbortSignal){
  const response=await fetch('/api/narration',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text}),signal});
  if(!response.ok)throw new Error(await response.text());
  const audio=await response.blob();if(!audio.type.includes('audio')||audio.size<1000)throw new Error('Bản giọng chưa tải hoàn chỉnh.');return audio;
}
export async function introAudioSources(guide=INTRO_GUIDE){
  let saved:NarrationRecord={};try{saved=await readNarration();}catch{/* Bundled guidance works without browser storage. */}
  const urls:string[]=[];
  const sources=guide.map(step=>{
    const record=saved[step.audio];
    if(record?.audio instanceof Blob&&record.audio.size>1000){const url=URL.createObjectURL(record.audio);urls.push(url);return url;}
    return `/audio/vi/${step.audio==='intro-2'?'intro-2-discovery':step.audio}.mp3`;
  });
  return {sources,release:()=>urls.forEach(url=>URL.revokeObjectURL(url))};
}
